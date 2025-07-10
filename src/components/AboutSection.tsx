
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Award, Users, Phone } from 'lucide-react';

interface AboutSectionProps {
  onBookingClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onBookingClick }) => {
  const achievements = [
    {
      icon: <MapPin className="w-6 h-6 text-sage-600" />,
      title: "Salvador - Bahia",
      description: "Raízes brasileiras, experiência internacional"
    },
    {
      icon: <Award className="w-6 h-6 text-gold-600" />,
      title: "20+ Anos de Experiência",
      description: "Dedicação constante ao cuidado de pessoas"
    },
    {
      icon: <Users className="w-6 h-6 text-forest-600" />,
      title: "Atendimento Personalizado",
      description: "Cada pessoa merece cuidado único"
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
                <div className="inline-flex items-center gap-2 bg-sage-50 px-6 py-2 rounded-full border border-sage-200 mb-6">
                  <Heart className="w-4 h-4 text-sage-600" />
                  <span className="text-sm font-medium text-darkgreen-800 font-bauer-bodoni">Sobre Mim</span>
                </div>
                
                <h2 className="font-tan-mon-cheri text-4xl md:text-5xl font-bold text-darkgreen-900 mb-8 leading-tight">
                  Muito gosto,{' '}
                  <span className="text-gold-600">eu sou Creusa Lima</span>
                </h2>
              </div>
              
              <div className="space-y-6 font-poppins text-lg text-forest-700 leading-relaxed mb-8">
                <p>
                  De <span className="font-semibold text-darkgreen-800">Salvador – Bahia</span> para Portugal, trago comigo mais de 20 anos de experiência dedicados ao cuidado de pessoas. Acredito que cada corpo tem uma história única e merece atenção, respeito e presença.
                </p>
                <p>
                  Especialista em <span className="font-semibold text-gold-700">linfoterapia, pós-operatório e estética</span>, atuo promovendo saúde, recuperação e qualidade de vida. Meu compromisso é oferecer tratamentos sob medida, alicerçados em conhecimento, sensibilidade e ética profissional.
                </p>
                <p>
                  O <span className="font-semibold text-darkgreen-800">toque terapêutico</span> é a minha ferramenta para devolver equilíbrio, bem-estar e autoconfiança aos meus clientes. Atendimento em ambiente discreto, seguro e acolhedor.
                </p>
                <div className="p-6 bg-gradient-to-r from-sage-50 to-gold-50 rounded-xl border border-sage-200">
                  <p className="text-darkgreen-800 font-semibold text-xl text-center font-tan-mon-cheri">
                    O toque cura. Uma boa conversa abraça a alma.
                  </p>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-darkgreen-700 to-darkgreen-800 hover:from-darkgreen-800 hover:to-darkgreen-900 text-white px-8 py-4 text-lg font-medium font-bauer-bodoni rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={onBookingClick}
              >
                <Phone className="w-5 h-5 mr-2" />
                Entre em Contacto
              </Button>
            </div>
            
            {/* Images and Stats */}
            <div className="animate-fade-in">
              <div className="relative">
                {/* Main professional photo */}
                <div className="w-full h-96 bg-gradient-to-br from-sage-100 to-gold-100 rounded-2xl shadow-2xl mb-8 border border-sage-200 overflow-hidden">
                  <img 
                    src="/lovable-uploads/73d8cd7b-d053-484a-b84e-0c423886228f.png" 
                    alt="Creusa Lima - Especialista em Estética e Linfoterapia"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Secondary professional photo - smaller */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-gold-100 to-sage-100 rounded-xl shadow-lg border-4 border-white overflow-hidden">
                  <img 
                    src="/lovable-uploads/f89fd8e5-45a3-4f6b-878e-d3f162b79dc1.png" 
                    alt="Creusa Lima - Profissional"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Achievement cards */}
                <div className="grid grid-cols-1 gap-4 mt-12">
                  {achievements.map((achievement, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-sage-100 to-gold-100 rounded-lg">
                          {achievement.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-darkgreen-900 mb-1 font-poppins">{achievement.title}</h4>
                          <p className="text-sm text-forest-600 font-poppins">{achievement.description}</p>
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
