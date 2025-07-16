
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings as SettingsIcon,
  Save
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type SiteSetting = Tables<'site_settings'>;

const SettingsManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data as SiteSetting[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (setting: Omit<SiteSetting, 'id' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('site_settings')
        .insert([setting])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({ title: 'Configuração criada com sucesso!' });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({ 
        title: 'Erro ao criar configuração', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...setting }: Partial<SiteSetting> & { id: string }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .update(setting)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({ title: 'Configuração atualizada com sucesso!' });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({ 
        title: 'Erro ao atualizar configuração', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({ title: 'Configuração eliminada com sucesso!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Erro ao eliminar configuração', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const handleOpenDialog = (setting?: SiteSetting) => {
    if (setting) {
      setEditingSetting(setting);
      setFormData({
        key: setting.key,
        value: setting.value,
        description: setting.description || ''
      });
    } else {
      setEditingSetting(null);
      setFormData({
        key: '',
        value: '',
        description: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSetting(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSetting) {
      updateMutation.mutate({ id: editingSetting.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Configurações padrão do sistema
  const defaultSettings = [
    {
      key: 'site_name',
      value: 'Creusa Lima - Beleza e Estética',
      description: 'Nome do site'
    },
    {
      key: 'whatsapp_number',
      value: '351964481966',
      description: 'Número do WhatsApp para contacto'
    },
    {
      key: 'whatsapp_confirmation_template',
      value: 'Olá {client_name}! Confirmamos a sua marcação para {service_name} no dia {date} às {time}. Obrigado!',
      description: 'Template de mensagem de confirmação do WhatsApp'
    },
    {
      key: 'business_email',
      value: 'info@creusalima.com',
      description: 'Email principal do negócio'
    },
    {
      key: 'business_phone',
      value: '+351 964 481 966',
      description: 'Telefone principal do negócio'
    }
  ];

  const handleCreateDefaults = async () => {
    for (const setting of defaultSettings) {
      const exists = settings?.find(s => s.key === setting.key);
      if (!exists) {
        createMutation.mutate(setting);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Site</h1>
        <div className="flex space-x-2">
          {(!settings || settings.length === 0) && (
            <Button onClick={handleCreateDefaults} variant="outline">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Criar Configurações Padrão
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Configuração
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingSetting ? 'Editar Configuração' : 'Criar Nova Configuração'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="key">Chave *</Label>
                  <Input
                    id="key"
                    value={formData.key}
                    onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="ex: site_name"
                    required
                    disabled={!!editingSetting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Identificador único da configuração (não pode ser alterado)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="value">Valor *</Label>
                  <Textarea
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição da configuração"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingSetting ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {settings?.map((setting) => (
          <Card key={setting.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{setting.key}</h3>
                    <Badge variant="outline">Configuração</Badge>
                  </div>
                  
                  {setting.description && (
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  )}
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-mono break-all">{setting.value}</p>
                  </div>
                  
                  {setting.updated_at && (
                    <p className="text-xs text-gray-500">
                      Última atualização: {new Date(setting.updated_at).toLocaleString('pt-PT')}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(setting)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(setting.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {settings?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                Nenhuma configuração encontrada. Crie as configurações padrão para começar!
              </p>
              <Button onClick={handleCreateDefaults}>
                <SettingsIcon className="h-4 w-4 mr-2" />
                Criar Configurações Padrão
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SettingsManager;
