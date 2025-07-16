
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Image, Type } from 'lucide-react';

const SiteContentManager: React.FC = () => {
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [heroContent, setHeroContent] = useState({
    title: '',
    subtitle: '',
    content: '',
    button_text: '',
    button_link: '',
    is_active: true
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch hero content from content_sections table
  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ['hero-content-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_type', 'hero_banner')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch site settings for background image
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['site-settings-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  React.useEffect(() => {
    if (heroData) {
      setHeroContent({
        title: heroData.title || '',
        subtitle: heroData.subtitle || '',
        content: heroData.content || '',
        button_text: heroData.button_text || '',
        button_link: heroData.button_link || '',
        is_active: heroData.is_active || true
      });
    }
  }, [heroData]);

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value }, { onConflict: 'key' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings-content'] });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating setting:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configurações.",
        variant: "destructive",
      });
    }
  });

  const updateHeroContentMutation = useMutation({
    mutationFn: async (content: typeof heroContent) => {
      if (heroData?.id) {
        // Update existing
        const { error } = await supabase
          .from('content_sections')
          .update({
            title: content.title,
            subtitle: content.subtitle,
            content: content.content,
            button_text: content.button_text,
            button_link: content.button_link,
            is_active: content.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', heroData.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('content_sections')
          .insert([{
            section_type: 'hero_banner',
            title: content.title,
            subtitle: content.subtitle,
            content: content.content,
            button_text: content.button_text,
            button_link: content.button_link,
            is_active: content.is_active,
            order_index: 0
          }]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-content-admin'] });
      queryClient.invalidateQueries({ queryKey: ['hero-content'] });
      toast({
        title: "Sucesso",
        description: "Conteúdo do hero atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating hero content:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar conteúdo do hero.",
        variant: "destructive",
      });
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHeroImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `hero_${Date.now()}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('site-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('site-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSaveHeroImage = async () => {
    if (!heroImage) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImageToStorage(heroImage);
      
      await updateSettingMutation.mutateAsync({
        key: 'hero_background_image',
        value: imageUrl
      });

      setHeroImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveHeroContent = () => {
    updateHeroContentMutation.mutate(heroContent);
  };

  const getSettingValue = (key: string) => {
    return settings?.find(s => s.key === key)?.value || '';
  };

  const currentHeroImage = getSettingValue('hero_background_image');

  if (heroLoading || settingsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Conteúdo do Site</h1>
      </div>

      {/* Hero Content Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Conteúdo da Secção Hero
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero-title">Título Principal</Label>
              <Input
                id="hero-title"
                value={heroContent.title}
                onChange={(e) => setHeroContent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Transforme-se com os nossos"
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtítulo</Label>
              <Input
                id="hero-subtitle"
                value={heroContent.subtitle}
                onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="tratamentos exclusivos"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="hero-content">Descrição</Label>
            <Textarea
              id="hero-content"
              value={heroContent.content}
              onChange={(e) => setHeroContent(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Descubra a harmonia perfeita entre beleza natural e bem-estar..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero-button-text">Texto do Botão</Label>
              <Input
                id="hero-button-text"
                value={heroContent.button_text}
                onChange={(e) => setHeroContent(prev => ({ ...prev, button_text: e.target.value }))}
                placeholder="Marcar Consulta"
              />
            </div>
            <div>
              <Label htmlFor="hero-button-link">Link do Botão</Label>
              <Input
                id="hero-button-link"
                value={heroContent.button_link}
                onChange={(e) => setHeroContent(prev => ({ ...prev, button_link: e.target.value }))}
                placeholder="#services ou https://..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hero-active"
              checked={heroContent.is_active}
              onCheckedChange={(checked) => setHeroContent(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="hero-active">Ativo</Label>
          </div>

          <Button 
            onClick={handleSaveHeroContent}
            disabled={updateHeroContentMutation.isPending}
            className="w-full"
          >
            {updateHeroContentMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Guardar Conteúdo do Hero
          </Button>
        </CardContent>
      </Card>

      {/* Hero Background Image Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Imagem de Fundo do Hero
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentHeroImage && (
            <div>
              <Label>Imagem Atual</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img 
                  src={currentHeroImage} 
                  alt="Imagem atual do hero" 
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="hero-image">Nova Imagem</Label>
            <Input
              id="hero-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1"
            />
          </div>

          {imagePreview && (
            <div>
              <Label>Pré-visualização</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Pré-visualização da nova imagem" 
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          <Button 
            onClick={handleSaveHeroImage}
            disabled={!heroImage || uploading || updateSettingMutation.isPending}
            className="w-full"
          >
            {(uploading || updateSettingMutation.isPending) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'A fazer upload...' : 'Guardar Nova Imagem'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteContentManager;
