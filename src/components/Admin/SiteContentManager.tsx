import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Image } from 'lucide-react';

const SiteContentManager: React.FC = () => {
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

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

  const handleSaveHeroImage = async () => {
    if (!heroImage) return;

    try {
      // Upload image to a public folder (you might want to implement proper file upload)
      // For now, we'll use a placeholder path
      const imagePath = `/uploads/hero-${Date.now()}.jpg`;
      
      // In a real implementation, you would upload to storage here
      // const { data: uploadData, error: uploadError } = await supabase.storage
      //   .from('images')
      //   .upload(imagePath, heroImage);

      // For demo purposes, we'll use the preview URL
      await updateSettingMutation.mutateAsync({
        key: 'hero_background_image',
        value: imagePreview
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
    }
  };

  const getSettingValue = (key: string) => {
    return settings?.find(s => s.key === key)?.value || '';
  };

  const currentHeroImage = getSettingValue('hero_background_image') || '/lovable-uploads/new-logo.png';

  if (isLoading) {
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

      {/* Hero Section Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Imagem de Fundo do Hero
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Image Preview */}
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

          {/* New Image Upload */}
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

          {/* Preview New Image */}
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

          {/* Save Button */}
          <Button 
            onClick={handleSaveHeroImage}
            disabled={!heroImage || updateSettingMutation.isPending}
            className="w-full"
          >
            {updateSettingMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Guardar Nova Imagem
          </Button>
        </CardContent>
      </Card>

      {/* Other Site Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Outras Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Link para Avaliações Google Maps</Label>
              <Input
                value={getSettingValue('google_maps_review_link')}
                onChange={(e) => {
                  updateSettingMutation.mutate({
                    key: 'google_maps_review_link',
                    value: e.target.value
                  });
                }}
                placeholder="https://www.google.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteContentManager;
