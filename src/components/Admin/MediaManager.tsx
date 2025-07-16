
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Upload, Star, Tag, X } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  service_id: string | null;
  file_size: number | null;
  dimensions: string | null;
  media_gallery_tags?: Array<{
    gallery_tags: {
      id: string;
      name: string;
      color: string;
    };
  }>;
  services?: {
    id: string;
    name: string;
  };
}

const MediaManager: React.FC = () => {
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['admin-enhanced-media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_gallery')
        .select(`
          *,
          media_gallery_tags (
            gallery_tags (
              id,
              name,
              color
            )
          ),
          services (
            id,
            name
          )
        `)
        .order('is_featured', { ascending: false })
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as MediaItem[];
    }
  });

  const { data: services } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, category')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: tags } = useQuery({
    queryKey: ['admin-gallery-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_tags')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const createMediaMutation = useMutation({
    mutationFn: async (media: Omit<MediaItem, 'id' | 'media_gallery_tags' | 'services'>) => {
      const { data, error } = await supabase
        .from('media_gallery')
        .insert([media])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: async (newMedia) => {
      // Add tags if selected
      if (selectedTags.length > 0) {
        await Promise.all(
          selectedTags.map(tagId =>
            supabase
              .from('media_gallery_tags')
              .insert({ media_id: newMedia.id, tag_id: tagId })
          )
        );
      }
      
      queryClient.invalidateQueries({ queryKey: ['admin-enhanced-media'] });
      toast.success('Média adicionado com sucesso!');
      resetForm();
    },
    onError: () => {
      toast.error('Erro ao adicionar média');
    }
  });

  const updateMediaMutation = useMutation({
    mutationFn: async ({ id, media_gallery_tags, services, ...media }: MediaItem & { media_gallery_tags?: any, services?: any }) => {
      const { data, error } = await supabase
        .from('media_gallery')
        .update(media)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: async (updatedMedia) => {
      // Update tags
      if (editingMedia) {
        // Remove existing tags
        await supabase
          .from('media_gallery_tags')
          .delete()
          .eq('media_id', editingMedia.id);
        
        // Add new tags
        if (selectedTags.length > 0) {
          await Promise.all(
            selectedTags.map(tagId =>
              supabase
                .from('media_gallery_tags')
                .insert({ media_id: editingMedia.id, tag_id: tagId })
            )
          );
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['admin-enhanced-media'] });
      toast.success('Média atualizado com sucesso!');
      resetForm();
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
      queryClient.invalidateQueries({ queryKey: ['admin-enhanced-media'] });
      toast.success('Média eliminado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao eliminar média');
    }
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingMedia(null);
    setSelectedTags([]);
  };

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
      order_index: parseInt(formData.get('order_index') as string) || 0,
      service_id: formData.get('service_id') as string || null,
      file_size: parseInt(formData.get('file_size') as string) || null,
      dimensions: formData.get('dimensions') as string || null
    };

    if (editingMedia) {
      updateMediaMutation.mutate({ ...mediaData, id: editingMedia.id });
    } else {
      createMediaMutation.mutate(mediaData);
    }
  };

  const startEdit = (media: MediaItem) => {
    setEditingMedia(media);
    setSelectedTags(media.media_gallery_tags?.map(t => t.gallery_tags.id) || []);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingMedia(null);
    setSelectedTags([]);
    setShowForm(true);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Galeria</h1>
          <p className="text-gray-600 mt-1">Gerir imagens, tags e categorização avançada</p>
        </div>
        <Button onClick={startCreate} className="bg-darkgreen-800 hover:bg-darkgreen-900">
          <Plus className="h-4 w-4 mr-2" />
          Nova Imagem
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingMedia ? 'Editar Imagem' : 'Nova Imagem'}
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="title"
                  placeholder="Título da imagem"
                  defaultValue={editingMedia?.title || ''}
                />
                <Input
                  name="file_url"
                  placeholder="URL da imagem *"
                  defaultValue={editingMedia?.file_url || ''}
                  required
                />
                <Input
                  name="alt_text"
                  placeholder="Texto alternativo (SEO)"
                  defaultValue={editingMedia?.alt_text || ''}
                />
                <Input
                  name="category"
                  placeholder="Categoria personalizada"
                  defaultValue={editingMedia?.category || ''}
                />
                <Select name="service_id" defaultValue={editingMedia?.service_id || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Associar a serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum serviço</SelectItem>
                    {services?.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  name="order_index"
                  type="number"
                  placeholder="Ordem de exibição"
                  defaultValue={editingMedia?.order_index || 0}
                />
                <Input
                  name="file_size"
                  type="number"
                  placeholder="Tamanho do ficheiro (KB)"
                  defaultValue={editingMedia?.file_size || ''}
                />
                <Input
                  name="dimensions"
                  placeholder="Dimensões (ex: 1920x1080)"
                  defaultValue={editingMedia?.dimensions || ''}
                />
              </div>
              
              <Textarea
                name="description"
                placeholder="Descrição detalhada"
                defaultValue={editingMedia?.description || ''}
                rows={3}
              />

              {/* Tags Selection */}
              {tags && tags.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                        className="cursor-pointer transition-all hover:scale-105"
                        style={{ 
                          borderColor: tag.color, 
                          backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                          color: selectedTags.includes(tag.id) ? 'white' : tag.color 
                        }}
                        onClick={() => toggleTag(tag.id)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

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
                <input type="hidden" name="file_type" value="image" />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-darkgreen-800 hover:bg-darkgreen-900">
                  {editingMedia ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mediaItems?.map((media) => (
          <Card key={media.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={media.file_url} 
                  alt={media.alt_text || media.title || ''} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {media.is_featured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                  {!media.is_active && (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold truncate text-darkgreen-900">
                    {media.title || 'Sem título'}
                  </h3>
                  {media.services && (
                    <p className="text-sm text-sage-600">
                      Serviço: {media.services.name}
                    </p>
                  )}
                </div>

                {media.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {media.description}
                  </p>
                )}

                {media.media_gallery_tags && media.media_gallery_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {media.media_gallery_tags.slice(0, 3).map(({ gallery_tags }) => (
                      <Badge
                        key={gallery_tags.id}
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: gallery_tags.color, color: gallery_tags.color }}
                      >
                        {gallery_tags.name}
                      </Badge>
                    ))}
                    {media.media_gallery_tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{media.media_gallery_tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(media)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Tem a certeza que deseja eliminar esta imagem?')) {
                        deleteMediaMutation.mutate(media.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!mediaItems || mediaItems.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma imagem na galeria
            </h3>
            <p className="text-gray-600 mb-4">
              Comece por adicionar a primeira imagem à sua galeria.
            </p>
            <Button onClick={startCreate} className="bg-darkgreen-800 hover:bg-darkgreen-900">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Imagem
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaManager;
