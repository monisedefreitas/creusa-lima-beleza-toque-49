
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Image, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  title: string | null;
  description: string | null;
  file_url: string;
  file_type: 'image' | 'video';
  category: string | null;
  alt_text: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  order_index: number | null;
}

const MediaManager: React.FC = () => {
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_gallery')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as MediaItem[];
    }
  });

  const createMediaMutation = useMutation({
    mutationFn: async (media: Omit<MediaItem, 'id'>) => {
      const { data, error } = await supabase
        .from('media_gallery')
        .insert([media])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Média adicionado com sucesso!');
      setShowForm(false);
      setEditingMedia(null);
    },
    onError: () => {
      toast.error('Erro ao adicionar média');
    }
  });

  const updateMediaMutation = useMutation({
    mutationFn: async ({ id, ...media }: MediaItem) => {
      const { data, error } = await supabase
        .from('media_gallery')
        .update(media)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Média atualizado com sucesso!');
      setShowForm(false);
      setEditingMedia(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar média');
    }
  });

  const deleteMediaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('media_gallery')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Média eliminado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao eliminar média');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const mediaData = {
      title: formData.get('title') as string || null,
      description: formData.get('description') as string || null,
      file_url: formData.get('file_url') as string,
      file_type: formData.get('file_type') as 'image' | 'video',
      category: formData.get('category') as string || null,
      alt_text: formData.get('alt_text') as string || null,
      is_active: formData.get('is_active') === 'on',
      is_featured: formData.get('is_featured') === 'on',
      order_index: parseInt(formData.get('order_index') as string) || 0
    };

    if (editingMedia) {
      updateMediaMutation.mutate({ ...mediaData, id: editingMedia.id });
    } else {
      createMediaMutation.mutate(mediaData);
    }
  };

  const startEdit = (media: MediaItem) => {
    setEditingMedia(media);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingMedia(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Galeria</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Galeria</h1>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Média
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingMedia ? 'Editar Média' : 'Novo Média'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="title"
                  placeholder="Título"
                  defaultValue={editingMedia?.title || ''}
                />
                <Input
                  name="category"
                  placeholder="Categoria"
                  defaultValue={editingMedia?.category || ''}
                />
                <Input
                  name="file_url"
                  placeholder="URL do ficheiro"
                  defaultValue={editingMedia?.file_url || ''}
                  required
                />
                <select
                  name="file_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={editingMedia?.file_type || 'image'}
                  required
                >
                  <option value="image">Imagem</option>
                  <option value="video">Vídeo</option>
                </select>
                <Input
                  name="alt_text"
                  placeholder="Texto alternativo"
                  defaultValue={editingMedia?.alt_text || ''}
                />
                <Input
                  name="order_index"
                  type="number"
                  placeholder="Ordem de exibição"
                  defaultValue={editingMedia?.order_index || 0}
                />
              </div>
              
              <Textarea
                name="description"
                placeholder="Descrição"
                defaultValue={editingMedia?.description || ''}
                rows={3}
              />

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    name="is_active"
                    defaultChecked={editingMedia?.is_active ?? true}
                  />
                  <label>Ativo</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    name="is_featured"
                    defaultChecked={editingMedia?.is_featured ?? false}
                  />
                  <label>Destacado</label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingMedia ? 'Atualizar' : 'Criar'}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mediaItems?.map((media) => (
          <Card key={media.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {media.file_type === 'image' ? (
                  <img 
                    src={media.file_url} 
                    alt={media.alt_text || media.title || ''} 
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate">{media.title || 'Sem título'}</h3>
                    <div className="flex items-center space-x-1">
                      {media.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Destacado
                        </span>
                      )}
                      {!media.is_active && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Inativo
                        </span>
                      )}
                    </div>
                  </div>
                  {media.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{media.description}</p>
                  )}
                  {media.category && (
                    <p className="text-xs text-gray-500 mt-1">Categoria: {media.category}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(media)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Tem a certeza que deseja eliminar este média?')) {
                        deleteMediaMutation.mutate(media.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
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

export default MediaManager;
