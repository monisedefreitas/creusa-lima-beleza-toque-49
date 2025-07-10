
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Award, Users } from 'lucide-react';

interface AboutSectionProps {
  onBookingClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onBookingClick }) => {
  const achievements = [
    {
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      title: "Salvador - Bahia",
      description: "Raízes brasileiras"
    },
    {
      icon: <Award className="w-6 h-6 text-gold-600" />,
      title: "7 Anos em Portugal",
      description: "Experiência consolidada"
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      title: "3 Anos Empreendendo",
      description: "Paixão transformada em missão"
    }
  ];

  return (
    <section id="sobre" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="animate-slide-in-left">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-emerald-50 px-6 py-2 rounded-full border border-emerald-200 mb-6">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">Sobre Mim</span>
                </div>
                
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-emerald-900 mb-8 leading-tight">
                  ✨ Muito gosto,{' '}
                  <span className="text-gold-600">eu sou a Creusa Lima</span> ✨
                </h2>
              </div>
              
              <div className="space-y-6 font-inter text-lg text-slate-700 leading-relaxed mb-8">
                <p>
                  Sou de <span className="font-semibold text-emerald-800">Salvador - Bahia</span>, mas há 7 anos encontrei em Portugal um novo lar. 🌿
                </p>
                <p>
                  Há 3 anos decidi empreender e viver com ainda mais propósito o que sempre foi minha paixão:{' '}
                  <span className="font-semibold text-gold-700">cuidar de pessoas</span>.
                </p>
                <p>
                  Sou especializada em <span className="font-semibold text-emerald-800">Linfoterapia, pós-operatório e bem-estar</span> — porque acredito que cada corpo tem uma história, 
                  e cada pessoa merece ser cuidada com atenção, presença e afeto.
                </p>
                <p>
                  Através do <span className="font-semibold text-gold-700">toque terapêutico</span>, ajudo a se reconectarem com o seu corpo e com o prazer de se cuidar.
                  Seja numa drenagem, numa massagem relaxante ou num tratamento de beleza, o meu compromisso é o mesmo: 
                  promover saúde, bem-estar e autoestima. 💆🏽‍♀️
                </p>
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-gold-50 rounded-xl border border-emerald-200">
                  <p className="text-emerald-800 font-semibold text-xl text-center">
                    🫶 O toque cura. E uma boa conversa abraça a alma.
                  </p>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={onBookingClick}
              >
                <Heart className="w-5 h-5 mr-2" />
                Fale Comigo pelo WhatsApp
              </Button>
            </div>
            
            {/* Image and Stats */}
            <div className="animate-fade-in">
              <div className="relative">
                {/* Placeholder for professional photo */}
                <div className="w-full h-96 bg-gradient-to-br from-emerald-100 to-gold-100 rounded-2xl shadow-2xl flex items-center justify-center mb-8 border border-emerald-200">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                      <Heart className="w-16 h-16 text-emerald-600" />
                    </div>
                    <p className="text-emerald-800 font-semibold">Foto Profissional</p>
                    <p className="text-slate-600 text-sm">Creusa Lima</p>
                  </div>
                </div>
                
                {/* Floating achievement cards */}
                <div className="grid grid-cols-1 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-100 to-gold-100 rounded-lg">
                          {achievement.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 mb-1">{achievement.title}</h4>
                          <p className="text-sm text-slate-600">{achievement.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
