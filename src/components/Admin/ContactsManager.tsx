
import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Phone, Mail, MapPin, Clock } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type ContactInfo = Tables<'contact_info'>;

const ContactsManager: React.FC = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ContactInfo>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ContactInfo> }) => {
      const { error } = await supabase
        .from('contact_info')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsEditing(null);
      setEditForm({});
      toast({
        title: "Sucesso",
        description: "Contacto atualizado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar contacto",
        variant: "destructive",
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newContact: Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('contact_info')
        .insert([newContact]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsEditing(null);
      setEditForm({});
      toast({
        title: "Sucesso",
        description: "Contacto criado com sucesso!",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_info')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: "Sucesso",
        description: "Contacto eliminado com sucesso!",
      });
    }
  });

  const handleEdit = (contact: ContactInfo) => {
    setIsEditing(contact.id);
    setEditForm(contact);
  };

  const handleSave = () => {
    if (!editForm.label || !editForm.value || !editForm.type) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (isEditing === 'new') {
      createMutation.mutate(editForm as Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>);
    } else if (isEditing) {
      updateMutation.mutate({ id: isEditing, updates: editForm });
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditForm({});
  };

  const handleAddNew = () => {
    setIsEditing('new');
    setEditForm({
      type: 'phone',
      label: '',
      value: '',
      is_primary: false,
      is_active: true,
      order_index: (contacts?.length || 0) + 1
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'address': return <MapPin className="h-4 w-4" />;
      case 'hours': return <Clock className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <div>Carregando contactos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Contactos</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Contacto
        </Button>
      </div>

      <div className="grid gap-4">
        {contacts?.map((contact) => (
          <Card key={contact.id}>
            <CardContent className="p-6">
              {isEditing === contact.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={editForm.type}
                        onValueChange={(value) => setEditForm({ ...editForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Telefone</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="address">Morada</SelectItem>
                          <SelectItem value="hours">Horário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="label">Etiqueta</Label>
                      <Input
                        value={editForm.label || ''}
                        onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                        placeholder="ex: Telefone Principal"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="value">Valor</Label>
                    <Input
                      value={editForm.value || ''}
                      onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                      placeholder="ex: +351 964 481 966"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editForm.is_primary || false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, is_primary: checked })}
                        />
                        <Label>Principal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editForm.is_active !== false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                        />
                        <Label>Ativo</Label>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSave}>
                        Guardar
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getIcon(contact.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{contact.label}</h3>
                      <p className="text-gray-600">{contact.value}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {contact.is_primary && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Principal</span>}
                        {!contact.is_active && <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Inativo</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(contact)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {isEditing === 'new' && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={editForm.type}
                      onValueChange={(value) => setEditForm({ ...editForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Telefone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="address">Morada</SelectItem>
                        <SelectItem value="hours">Horário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="label">Etiqueta</Label>
                    <Input
                      value={editForm.label || ''}
                      onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                      placeholder="ex: Telefone Principal"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="value">Valor</Label>
                  <Input
                    value={editForm.value || ''}
                    onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                    placeholder="ex: +351 964 481 966"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editForm.is_primary || false}
                        onCheckedChange={(checked) => setEditForm({ ...editForm, is_primary: checked })}
                      />
                      <Label>Principal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editForm.is_active !== false}
                        onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                      />
                      <Label>Ativo</Label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      Criar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContactsManager;
