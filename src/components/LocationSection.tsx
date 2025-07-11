
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Car, Phone } from 'lucide-react';
import GoogleMap from './GoogleMap';

export const LocationSection: React.FC = () => {
  const locationFeatures = [
    {
      icon: <Car className="w-5 h-5 text-emerald-600" />,
      title: "Estacionamento",
      description: "Fácil acesso e estacionamento disponível"
    },
    {
      icon: <Clock className="w-5 h-5 text-gold-600" />,
      title: "Horários Flexíveis",
      description: "Agendamento conforme sua disponibilidade"
    },
    {
      icon: <Phone className="w-5 h-5 text-emerald-600" />,
      title: "Atendimento Personalizado",
      description: "Consulta prévia para melhor atendimento"
    }
  ];

  return (
    <section id="localizacao" className="py-20 px-4 bg-gradient-to-br from-emerald-50/50 to-gold-50/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-emerald-900 mb-6">
            Nossa Localização Premium
          </h2>
          <p className="font-inter text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Encontre-nos no coração de Carcavelos, em um espaço pensado para o seu bem-estar
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Location Details */}
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-gold-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-playfair text-2xl font-semibold text-emerald-900 mb-2">
                        Espaço Sinergia
                      </h3>
                      <p className="font-inter text-lg text-slate-700 leading-relaxed">
                        Rua Fernando Lopes Graça 379 B<br />
                        Cascais 2775-571 Carcavelos<br />
                        <span className="text-emerald-700 font-medium">Portugal</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {locationFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg">
                        {feature.icon}
                        <div>
                          <h4 className="font-semibold text-emerald-900 text-sm">{feature.title}</h4>
                          <p className="text-slate-600 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Facilities Preview */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-800 to-emerald-900 text-white">
                <CardContent className="p-8 text-center">
                  <h3 className="font-playfair text-2xl font-semibold mb-4">
                    Ambiente Acolhedor & Profissional
                  </h3>
                  <p className="font-inter text-emerald-100 leading-relaxed mb-6">
                    Um espaço pensado para proporcionar máximo conforto e tranquilidade durante seus tratamentos.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="font-semibold">Higiene Premium</div>
                      <div className="text-emerald-200">Protocolos rigorosos</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="font-semibold">Equipamentos</div>
                      <div className="text-emerald-200">Tecnologia avançada</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Map Area */}
            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover-lift">
                <CardContent className="p-0">
                  <GoogleMap className="h-80" />
                </CardContent>
              </Card>
              
              {/* Transport Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 text-center">
                  <div className="text-emerald-800 font-semibold text-sm mb-1">Metro</div>
                  <div className="text-slate-600 text-xs">Linha de Cascais</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gold-200 text-center">
                  <div className="text-gold-700 font-semibold text-sm mb-1">Autocarro</div>
                  <div className="text-slate-600 text-xs">Várias linhas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
