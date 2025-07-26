
import * as React from 'react';
import { useState } from 'react';
import { 
  User, 
  Award, 
  Calendar, 
  Users, 
  Heart,
  Star,
  MessageSquare,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/Performance/LazyImage';
import TestimonialForm from '@/components/TestimonialForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AboutSection: React.FC = () => {
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  const { data: contentSections } = useQuery({
    queryKey: ['content-sections-about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_type', 'about_section')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });

  const aboutContent = contentSections?.[0];

  const stats = [
    {
      icon: MapPin,
      value: "Salvador - Bahia",
      label: "Raízes Brasileiras",
      subtitle: "Experiência Internacional",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Calendar,
      value: "20+",
      label: "Anos de Experiência",
      subtitle: "Dedicados ao Cuidado",
      color: "from-sage-500 to-sage-700"
    },
    {
      icon: Users,
      value: "Atendimento",
      label: "Personalizado",
      subtitle: "Cada pessoa merece cuidado único",
      color: "from-darkgreen-500 to-darkgreen-700"
    },
    {
      icon: Heart,
      value: "∞",
      label: "Paixão pelo que Faço",
      subtitle: "Amor em cada tratamento",
      color: "from-rose-500 to-pink-600"
    }
  ];

  const achievements = [
    "Especialista em Linfoterapia",
    "Tratamentos Pós-Operatório",
    "Estética Corporal e Facial",
    "Terapias de Bem-Estar"
  ];

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-sage-50 via-white to-sage-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-0 w-96 h-96 bg-sage-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-darkgreen-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-sage-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-sage-600" />
            <span className="text-sage-700 font-medium">Sobre Mim</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="text-darkgreen-900 block mb-2">Cuidados que</span>
            <span className="text-transparent bg-gradient-to-r from-sage-600 to-darkgreen-700 bg-clip-text">
              Transformam Vidas
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dedicada a realçar a sua beleza natural com cuidado, técnica e paixão
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-sage-500 to-sage-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-darkgreen-800">Minha História</h3>
            </div>
            
            {aboutContent?.content ? (
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                {aboutContent.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="animate-fade-in-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  De Salvador – Bahia para Portugal, trago comigo mais de 20 anos de experiência dedicados ao cuidado de pessoas. 
                  Acredito que cada corpo tem uma história única e merece atenção, respeito e presença.
                </p>
                
                <p className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  Especialista em linfoterapia, pós-operatório e estética, atuo promovendo saúde, recuperação e qualidade de vida. 
                  Meu compromisso é oferecer tratamentos sob medida, alicerçados em conhecimento, sensibilidade e ética profissional.
                </p>

                <p className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  O toque terapêutico é a minha ferramenta para devolver equilíbrio, bem-estar e autoconfiança aos meus clientes. 
                  Atendimento em ambiente discreto, seguro e acolhedor.
                </p>
              </div>
            )}

            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <h4 className="text-xl font-semibold text-darkgreen-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                Especializações
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 bg-white/60 backdrop-blur-sm p-3 rounded-lg hover:bg-white/80 transition-all duration-300">
                    <Star className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span className="font-medium">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-sage-200 to-darkgreen-200 rounded-3xl blur-xl opacity-30"></div>
              <LazyImage 
                src="/lovable-uploads/f89fd8e5-45a3-4f6b-878e-d3f162b79dc1.png" 
                alt="Profile Image" 
                className="relative rounded-3xl shadow-2xl border-4 border-white w-full h-auto max-w-md hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-sage-100 animate-fade-in-up"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="relative p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-2xl font-bold text-darkgreen-800 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-darkgreen-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600 leading-relaxed">{stat.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center bg-gradient-to-r from-sage-50 to-darkgreen-50 rounded-3xl p-12 shadow-lg animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-sage-100 px-4 py-2 rounded-full mb-6">
              <MessageSquare className="w-5 h-5 text-sage-600" />
              <span className="text-sage-700 font-medium">Depoimentos</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-darkgreen-800 mb-6">
              Partilhe a Sua Experiência
            </h3>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A sua opinião é muito importante para mim. Partilhe como foi a sua experiência 
              e ajude outras pessoas a conhecer o meu trabalho.
            </p>
            
            <Dialog open={showTestimonialForm} onOpenChange={setShowTestimonialForm}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-full"
                >
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Enviar Depoimento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <TestimonialForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
