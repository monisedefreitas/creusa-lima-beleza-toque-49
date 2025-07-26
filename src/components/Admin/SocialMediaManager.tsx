
import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Instagram, Facebook, MessageCircle, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface SocialMedia {
  id: string;
  platform: 'instagram' | 'facebook' | 'whatsapp' | 'phone' | 'email';
  url: string;
  username: string | null;
  is_active: boolean | null;
  order_index: number | null;
}

const SocialMediaManager: React.FC = () => {
  const [editingSocial, setEditingSocial] = useState<SocialMedia | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: socialMedia, isLoading } = useQuery({
    queryKey: ['admin-social-media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as SocialMedia[];
    }
  });

  const createSocialMutation = useMutation({
    mutationFn: async (social: Omit<SocialMedia, 'id'>) => {
      const { data, error } = await supabase
        .from('social_media')
        .insert([social])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-social-media'] });
      toast.success('Rede social adicionada com sucesso!');
      setShowForm(false);
      setEditingSocial(null);
    },
    onError: () => {
      toast.error('Erro ao adicionar rede social');
    }
  });

  const updateSocialMutation = useMutation({
    mutationFn: async ({ id, ...social }: SocialMedia) => {
      const { data, error } = await supabase
        .from('social_media')
        .update(social)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-social-media'] });
      toast.success('Rede social atualizada com sucesso!');
      setShowForm(false);
      setEditingSocial(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar rede social');
    }
  });

  const deleteSocialMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_media')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-social-media'] });
      toast.success('Rede social eliminada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao eliminar rede social');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const socialData = {
      platform: formData.get('platform') as SocialMedia['platform'],
      url: formData.get('url') as string,
      username: formData.get('username') as string || null,
      is_active: formData.get('is_active') === 'on',
      order_index: parseInt(formData.get('order_index') as string) || 0
    };

    if (editingSocial) {
      updateSocialMutation.mutate({ ...socialData, id: editingSocial.id });
    } else {
      createSocialMutation.mutate(socialData);
    }
  };

  const startEdit = (social: SocialMedia) => {
    setEditingSocial(social);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingSocial(null);
    setShowForm(true);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'facebook': return <Facebook className="h-5 w-5 text-blue-500" />;
      case 'whatsapp': return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'phone': return <Phone className="h-5 w-5 text-gray-500" />;
      case 'email': return <Mail className="h-5 w-5 text-red-500" />;
      default: return <div className="h-5 w-5 bg-gray-300 rounded" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'Instagram';
      case 'facebook': return 'Facebook';
      case 'whatsapp': return 'WhatsApp';
      case 'phone': return 'Telefone';
      case 'email': return 'Email';
      default: return platform;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Redes Sociais</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Redes Sociais</h1>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Rede Social
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSocial ? 'Editar Rede Social' : 'Nova Rede Social'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plataforma</label>
                  <select
                    name="platform"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={editingSocial?.platform || 'instagram'}
                    required
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Telefone</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <Input
                  name="order_index"
                  type="number"
                  placeholder="Ordem de exibição"
                  defaultValue={editingSocial?.order_index || 0}
                />
              </div>
              
              <Input
                name="url"
                placeholder="URL ou contacto"
                defaultValue={editingSocial?.url || ''}
                required
              />
              
              <Input
                name="username"
                placeholder="Nome de utilizador (opcional)"
                defaultValue={editingSocial?.username || ''}
              />

              <div className="flex items-center space-x-2">
                <Switch
                  name="is_active"
                  defaultChecked={editingSocial?.is_active ?? true}
                />
                <label>Ativo</label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingSocial ? 'Atualizar' : 'Criar'}
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
        {socialMedia?.map((social) => (
          <Card key={social.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getPlatformIcon(social.platform)}
                  <div>
                    <h3 className="text-lg font-semibold">{getPlatformName(social.platform)}</h3>
                    <p className="text-gray-600">{social.url}</p>
                    {social.username && (
                      <p className="text-sm text-gray-500">@{social.username}</p>
                    )}
                  </div>
                  {!social.is_active && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      Inativo
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(social)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Tem a certeza que deseja eliminar esta rede social?')) {
                        deleteSocialMutation.mutate(social.id);
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

export default SocialMediaManager;
