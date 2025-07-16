
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Address {
  id: string;
  name: string;
  street_address: string;
  city: string;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean | null;
  is_primary: boolean | null;
  order_index: number | null;
}

const AddressesManager: React.FC = () => {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['admin-addresses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as Address[];
    }
  });

  const createAddressMutation = useMutation({
    mutationFn: async (address: Omit<Address, 'id'>) => {
      const { data, error } = await supabase
        .from('addresses')
        .insert([address])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-addresses'] });
      toast.success('Morada adicionada com sucesso!');
      setShowForm(false);
      setEditingAddress(null);
    },
    onError: () => {
      toast.error('Erro ao adicionar morada');
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, ...address }: Address) => {
      const { data, error } = await supabase
        .from('addresses')
        .update(address)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-addresses'] });
      toast.success('Morada atualizada com sucesso!');
      setShowForm(false);
      setEditingAddress(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar morada');
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-addresses'] });
      toast.success('Morada eliminada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao eliminar morada');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const addressData = {
      name: formData.get('name') as string,
      street_address: formData.get('street_address') as string,
      city: formData.get('city') as string,
      postal_code: formData.get('postal_code') as string || null,
      country: formData.get('country') as string || 'Portugal',
      latitude: parseFloat(formData.get('latitude') as string) || null,
      longitude: parseFloat(formData.get('longitude') as string) || null,
      is_active: formData.get('is_active') === 'on',
      is_primary: formData.get('is_primary') === 'on',
      order_index: parseInt(formData.get('order_index') as string) || 0
    };

    if (editingAddress) {
      updateAddressMutation.mutate({ ...addressData, id: editingAddress.id });
    } else {
      createAddressMutation.mutate(addressData);
    }
  };

  const startEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Moradas</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Moradas</h1>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Morada
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAddress ? 'Editar Morada' : 'Nova Morada'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  placeholder="Nome da localização"
                  defaultValue={editingAddress?.name || ''}
                  required
                />
                <Input
                  name="order_index"
                  type="number"
                  placeholder="Ordem de exibição"
                  defaultValue={editingAddress?.order_index || 0}
                />
              </div>
              
              <Input
                name="street_address"
                placeholder="Morada completa"
                defaultValue={editingAddress?.street_address || ''}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  name="city"
                  placeholder="Cidade"
                  defaultValue={editingAddress?.city || ''}
                  required
                />
                <Input
                  name="postal_code"
                  placeholder="Código postal"
                  defaultValue={editingAddress?.postal_code || ''}
                />
                <Input
                  name="country"
                  placeholder="País"
                  defaultValue={editingAddress?.country || 'Portugal'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="latitude"
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  defaultValue={editingAddress?.latitude || ''}
                />
                <Input
                  name="longitude"
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  defaultValue={editingAddress?.longitude || ''}
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    name="is_active"
                    defaultChecked={editingAddress?.is_active ?? true}
                  />
                  <label>Ativo</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    name="is_primary"
                    defaultChecked={editingAddress?.is_primary ?? false}
                  />
                  <label>Principal</label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingAddress ? 'Atualizar' : 'Criar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {addresses?.map((address) => (
          <Card key={address.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{address.name}</h3>
                      {address.is_primary && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Principal
                        </span>
                      )}
                      {!address.is_active && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{address.street_address}</p>
                    <p className="text-gray-600">
                      {address.city}
                      {address.postal_code && `, ${address.postal_code}`}
                      {address.country && `, ${address.country}`}
                    </p>
                    {(address.latitude && address.longitude) && (
                      <p className="text-sm text-gray-500 mt-1">
                        Coordenadas: {address.latitude}, {address.longitude}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(address)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Tem a certeza que deseja eliminar esta morada?')) {
                        deleteAddressMutation.mutate(address.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddressesManager;
