
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, Globe, MapPin, Star } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SiteConfigManager: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data;
    }
  });

  React.useEffect(() => {
    if (settings) {
      const data: Record<string, string> = {};
      settings.forEach(setting => {
        data[setting.key] = setting.value;
      });
      setFormData(data);
    }
  }, [settings]);

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ key, value }, { onConflict: 'key' })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Configuração atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar configuração');
    }
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    const value = formData[key] || '';
    updateSettingMutation.mutate({ key, value });
  };

  const configSections = [
    {
      title: 'Google Maps & Avaliações',
      icon: <MapPin className="h-5 w-5" />,
      settings: [
        {
          key: 'google_maps_review_link',
          label: 'Link para Avaliações Google Maps',
          description: 'Link direto para deixar avaliação no Google Maps',
          placeholder: 'https://g.page/r/...'
        },
        {
          key: 'google_maps_embed_url',
          label: 'URL de Incorporação do Google Maps',
          description: 'URL para exibir o mapa na página de contacto',
          placeholder: 'https://www.google.com/maps/embed?pb=...'
        }
      ]
    },
    {
      title: 'SEO & Meta Tags',
      icon: <Globe className="h-5 w-5" />,
      settings: [
        {
          key: 'site_title',
          label: 'Título do Site',
          description: 'Título principal que aparece no navegador',
          placeholder: 'Clínica de Medicina Estética'
        },
        {
          key: 'site_description',
          label: 'Descrição do Site',
          description: 'Descrição para motores de busca (máx. 160 caracteres)',
          placeholder: 'A melhor clínica de medicina estética em Lisboa...',
          type: 'textarea'
        },
        {
          key: 'site_keywords',
          label: 'Palavras-chave',
          description: 'Palavras-chave separadas por vírgulas',
          placeholder: 'medicina estética, botox, preenchimento, lisboa'
        }
      ]
    },
    {
      title: 'Análise & Tracking',
      icon: <Settings className="h-5 w-5" />,
      settings: [
        {
          key: 'google_analytics_id',
          label: 'Google Analytics ID',
          description: 'ID do Google Analytics (GA4)',
          placeholder: 'G-XXXXXXXXXX'
        },
        {
          key: 'facebook_pixel_id',
          label: 'Facebook Pixel ID',
          description: 'ID do pixel do Facebook para tracking',
          placeholder: '1234567890123456'
        }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Site</h1>
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
      <div className="flex items-center space-x-3">
        <Settings className="h-8 w-8 text-darkgreen-800" />
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Site</h1>
      </div>

      <div className="grid gap-6">
        {configSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {section.icon}
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.label}
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        {setting.description}
                      </p>
                    </div>
                    <Badge variant={formData[setting.key] ? "default" : "secondary"}>
                      {formData[setting.key] ? "Configurado" : "Não configurado"}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    {setting.type === 'textarea' ? (
                      <Textarea
                        id={setting.key}
                        value={formData[setting.key] || ''}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        placeholder={setting.placeholder}
                        rows={3}
                        className="flex-1"
                      />
                    ) : (
                      <Input
                        id={setting.key}
                        value={formData[setting.key] || ''}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        placeholder={setting.placeholder}
                        className="flex-1"
                      />
                    )}
                    
                    <Button
                      onClick={() => handleSave(setting.key)}
                      disabled={updateSettingMutation.isPending}
                      size="sm"
                      className="bg-darkgreen-800 hover:bg-darkgreen-900"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                onClick={() => window.open('https://search.google.com/search-console', '_blank')}
              >
                <div className="font-semibold">Google Search Console</div>
                <div className="text-sm text-gray-500">Gerir presença nos resultados do Google</div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                onClick={() => window.open('https://analytics.google.com', '_blank')}
              >
                <div className="font-semibold">Google Analytics</div>
                <div className="text-sm text-gray-500">Ver estatísticas do site</div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteConfigManager;
