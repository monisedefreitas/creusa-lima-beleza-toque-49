
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, Shield, X } from 'lucide-react';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const existingConsent = localStorage.getItem('cookieConsent');
    if (!existingConsent) {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (consentData: CookieConsent) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...consentData,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const acceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    saveConsent(fullConsent);
  };

  const acceptSelected = () => {
    saveConsent(consent);
  };

  const rejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    saveConsent(minimalConsent);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-t border-sage-200 shadow-lg">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="w-6 h-6 text-darkgreen-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-darkgreen-900 mb-2">
                Utilizamos Cookies
              </h3>
              <p className="text-darkgreen-700 mb-4">
                Este site utiliza cookies para melhorar a sua experiência de navegação, 
                analisar o tráfego e personalizar conteúdo. Ao continuar a navegar, 
                concorda com a nossa utilização de cookies conforme descrito na nossa{' '}
                <a href="/privacy-policy" className="text-sage-600 hover:text-sage-700 underline">
                  Política de Privacidade
                </a>.
              </p>
              
              {showDetails && (
                <div className="mb-4 p-4 bg-sage-50 rounded-lg">
                  <h4 className="font-medium text-darkgreen-900 mb-3">Configurações de Cookies</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-darkgreen-800">Cookies Necessários</span>
                        <p className="text-sm text-darkgreen-600">Essenciais para o funcionamento do site</p>
                      </div>
                      <input type="checkbox" checked={true} disabled className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-darkgreen-800">Cookies Analíticos</span>
                        <p className="text-sm text-darkgreen-600">Ajudam-nos a melhorar o site</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={consent.analytics}
                        onChange={(e) => setConsent({...consent, analytics: e.target.checked})}
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-darkgreen-800">Cookies de Marketing</span>
                        <p className="text-sm text-darkgreen-600">Para personalizar anúncios</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={consent.marketing}
                        onChange={(e) => setConsent({...consent, marketing: e.target.checked})}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={acceptAll}
                  className="bg-darkgreen-700 hover:bg-darkgreen-800 text-white"
                >
                  Aceitar Todos
                </Button>
                <Button 
                  onClick={rejectAll}
                  variant="outline" 
                  className="border-sage-300 text-darkgreen-700 hover:bg-sage-50"
                >
                  Rejeitar Opcionais
                </Button>
                <Button 
                  onClick={() => setShowDetails(!showDetails)}
                  variant="ghost" 
                  className="text-darkgreen-600 hover:text-darkgreen-700"
                >
                  {showDetails ? 'Ocultar' : 'Personalizar'}
                </Button>
                {showDetails && (
                  <Button 
                    onClick={acceptSelected}
                    className="bg-sage-600 hover:bg-sage-700 text-white"
                  >
                    Guardar Preferências
                  </Button>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={rejectAll}
              className="text-darkgreen-600 hover:text-darkgreen-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieBanner;
