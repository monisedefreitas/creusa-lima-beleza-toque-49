
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
import { Save, Upload, Image, Type, Monitor, Smartphone } from 'lucide-react';

const SiteContentManager: React.FC = () => {
  const [desktopImage, setDesktopImage] = useState<File | null>(null);
  const [mobileImage, setMobileImage] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState<string>('');
  const [mobilePreview, setMobilePreview] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
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

  // Fetch site settings for background images and logo
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
      queryClient.invalidateQueries({ queryKey: ['hero-content'] });
      queryClient.invalidateQueries({ queryKey: ['site-logo'] });
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

  const handleDesktopImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDesktopImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setDesktopPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMobileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMobilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToStorage = async (file: File, type: 'desktop' | 'mobile'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `hero_${type}_${Date.now()}.${fileExt}`;
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

  const uploadLogoToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo_${Date.now()}.${fileExt}`;
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

  const handleSaveLogo = async () => {
    if (!logoFile) return;

    setUploading(true);
    try {
      const logoUrl = await uploadLogoToStorage(logoFile);
      
      await updateSettingMutation.mutateAsync({
        key: 'site_logo',
        value: logoUrl
      });

      setLogoFile(null);
      setLogoPreview('');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da logo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDesktopImage = async () => {
    if (!desktopImage) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImageToStorage(desktopImage, 'desktop');
      
      await updateSettingMutation.mutateAsync({
        key: 'hero_background_image_desktop',
        value: imageUrl
      });

      setDesktopImage(null);
      setDesktopPreview('');
    } catch (error) {
      console.error('Error uploading desktop image:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem desktop.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMobileImage = async () => {
    if (!mobileImage) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImageToStorage(mobileImage, 'mobile');
      
      await updateSettingMutation.mutateAsync({
        key: 'hero_background_image_mobile',
        value: imageUrl
      });

      setMobileImage(null);
      setMobilePreview('');
    } catch (error) {
      console.error('Error uploading mobile image:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem mobile.",
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

  const currentDesktopImage = getSettingValue('hero_background_image_desktop');
  const currentMobileImage = getSettingValue('hero_background_image_mobile');
  const currentLogo = getSettingValue('site_logo');

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

      {/* Logo Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Logo do Site
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentLogo && (
            <div>
              <Label>Logo Atual</Label>
              <div className="mt-2 border rounded-lg overflow-hidden bg-gray-50 p-4">
                <img 
                  src={currentLogo} 
                  alt="Logo atual" 
                  className="h-12 w-auto"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="logo-upload">Nova Logo</Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mt-1"
            />
          </div>

          {logoPreview && (
            <div>
              <Label>Pré-visualização</Label>
              <div className="mt-2 border rounded-lg overflow-hidden bg-gray-50 p-4">
                <img 
                  src={logoPreview} 
                  alt="Pré-visualização da nova logo" 
                  className="h-12 w-auto"
                />
              </div>
            </div>
          )}

          <Button 
            onClick={handleSaveLogo}
            disabled={!logoFile || uploading || updateSettingMutation.isPending}
            className="w-full"
          >
            {(uploading || updateSettingMutation.isPending) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'A fazer upload...' : 'Guardar Nova Logo'}
          </Button>
        </CardContent>
      </Card>

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

      {/* Hero Background Images Management - Desktop */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Imagem de Fundo Hero - Desktop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentDesktopImage && (
            <div>
              <Label>Imagem Desktop Atual</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img 
                  src={currentDesktopImage} 
                  alt="Imagem desktop atual do hero" 
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="desktop-image">Nova Imagem Desktop</Label>
            <Input
              id="desktop-image"
              type="file"
              accept="image/*"
              onChange={handleDesktopImageUpload}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: 1920x1080px ou superior para melhor qualidade em ecrãs grandes
            </p>
          </div>

          {desktopPreview && (
            <div>
              <Label>Pré-visualização Desktop</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img 
                  src={desktopPreview} 
                  alt="Pré-visualização da nova imagem desktop" 
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          <Button 
            onClick={handleSaveDesktopImage}
            disabled={!desktopImage || uploading || updateSettingMutation.isPending}
            className="w-full"
          >
            {(uploading || updateSettingMutation.isPending) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'A fazer upload...' : 'Guardar Imagem Desktop'}
          </Button>
        </CardContent>
      </Card>

      {/* Hero Background Images Management - Mobile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Imagem de Fundo Hero - Mobile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentMobileImage && (
            <div>
              <Label>Imagem Mobile Atual</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img 
                  src={currentMobileImage} 
                  alt="Imagem mobile atual do hero" 
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="mobile-image">Nova Imagem Mobile</Label>
            <Input
              id="mobile-image"
              type="file"
              accept="image/*"
              onChange={handleMobileImageUpload}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: 768x1024px (formato vertical) para melhor experiência em dispositivos móveis
            </p>
          </div>

          {mobilePreview && (
            <div>
              <Label>Pré-visualização Mobile</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img 
                  src={mobilePreview} 
                  alt="Pré-visualização da nova imagem mobile" 
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          <Button 
            onClick={handleSaveMobileImage}
            disabled={!mobileImage || uploading || updateSettingMutation.isPending}
            className="w-full"
          >
            {(uploading || updateSettingMutation.isPending) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'A fazer upload...' : 'Guardar Imagem Mobile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteContentManager;
