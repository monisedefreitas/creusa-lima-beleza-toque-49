import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Star, Image } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  short_description: string | null;
  description: string | null;
  price_range: string | null;
  duration_minutes: number | null;
  category: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  order_index: number | null;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  service_id: string | null;
  is_active: boolean | null;
}

const ServicesManager: React.FC = () => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [selectedServiceForBanner, setSelectedServiceForBanner] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as Service[];
    }
  });

  const { data: banners } = useQuery({
    queryKey: ['service-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('position', 'services')
        .order('order_index');
      
      if (error) throw error;
      return data as Banner[];
    }
  });

  const createServiceMutation = useMutation({
    mutationFn: async (service: Omit<Service, 'id'>) => {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Serviço criado com sucesso!');
      setShowForm(false);
      setEditingService(null);
    },
    onError: () => {
      toast.error('Erro ao criar serviço');
    }
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, ...service }: Service) => {
      const { data, error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Serviço atualizado com sucesso!');
      setShowForm(false);
      setEditingService(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar serviço');
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Serviço eliminado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao eliminar serviço');
    }
  });

  const createBannerMutation = useMutation({
    mutationFn: async (bannerData: {
      title: string;
      subtitle: string;
      description: string;
      service_id: string;
    }) => {
      const { data, error } = await supabase
        .from('banners')
        .insert([{
          ...bannerData,
          position: 'services',
          is_active: true,
          order_index: 0
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-banners'] });
      toast.success('Banner criado com sucesso!');
      setShowBannerForm(false);
    },
    onError: () => {
      toast.error('Erro ao criar banner');
    }
  });

  const handleCreateBanner = (serviceId: string, serviceName: string) => {
    const bannerData = {
      title: `Promoção ${serviceName}`,
      subtitle: 'Oferta especial limitada',
      description: `Descubra os benefícios do nosso tratamento de ${serviceName} com condições especiais.`,
      service_id: serviceId
    };
    
    createBannerMutation.mutate(bannerData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const serviceData = {
      name: formData.get('name') as string,
      short_description: formData.get('short_description') as string || null,
      description: formData.get('description') as string || null,
      price_range: formData.get('price_range') as string || null,
      duration_minutes: parseInt(formData.get('duration_minutes') as string) || null,
      category: formData.get('category') as string || null,
      is_active: formData.get('is_active') === 'on',
      is_featured: formData.get('is_featured') === 'on',
      order_index: parseInt(formData.get('order_index') as string) || 0
    };

    if (editingService) {
      updateServiceMutation.mutate({ ...serviceData, id: editingService.id });
    } else {
      createServiceMutation.mutate(serviceData);
    }
  };

  const startEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingService(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Serviços</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
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
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Serviços</h1>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  placeholder="Nome do serviço"
                  defaultValue={editingService?.name || ''}
                  required
                />
                <Input
                  name="category"
                  placeholder="Categoria"
                  defaultValue={editingService?.category || ''}
                />
                <Input
                  name="price_range"
                  placeholder="Preço (ex: 35€-45€)"
                  defaultValue={editingService?.price_range || ''}
                />
                <Input
                  name="duration_minutes"
                  type="number"
                  placeholder="Duração (minutos)"
                  defaultValue={editingService?.duration_minutes || ''}
                />
                <Input
                  name="order_index"
                  type="number"
                  placeholder="Ordem de exibição"
                  defaultValue={editingService?.order_index || 0}
                />
              </div>
              
              <Input
                name="short_description"
                placeholder="Descrição curta"
                defaultValue={editingService?.short_description || ''}
              />
              
              <Textarea
                name="description"
                placeholder="Descrição completa"
                defaultValue={editingService?.description || ''}
                rows={4}
              />

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    name="is_active"
                    defaultChecked={editingService?.is_active ?? true}
                  />
                  <label>Ativo</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    name="is_featured"
                    defaultChecked={editingService?.is_featured ?? false}
                  />
                  <label>Destacado</label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingService ? 'Atualizar' : 'Criar'}
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
        {services?.map((service) => {
          const serviceBanner = banners?.find(b => b.service_id === service.id);
          
          return (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      {service.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                      {!service.is_active && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Inativo
                        </span>
                      )}
                      {serviceBanner && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded flex items-center">
                          <Image className="h-3 w-3 mr-1" />
                          Com Banner
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{service.short_description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {service.category && (
                        <span>Categoria: {service.category}</span>
                      )}
                      {service.price_range && (
                        <span>Preço: {service.price_range}</span>
                      )}
                      {service.duration_minutes && (
                        <span>Duração: {service.duration_minutes}min</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!serviceBanner && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateBanner(service.id, service.name)}
                      >
                        <Image className="h-4 w-4 mr-1" />
                        Criar Banner
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Tem a certeza que deseja eliminar este serviço?')) {
                          deleteServiceMutation.mutate(service.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesManager;
