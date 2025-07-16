
import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Calendar, 
  Users, 
  Heart,
  Star,
  MessageSquare
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
      icon: Users,
      value: "500+",
      label: "Clientes Satisfeitos"
    },
    {
      icon: Calendar,
      value: "20+",
      label: "Anos de Experiência"
    },
    {
      icon: Award,
      value: "100%",
      label: "Dedicação"
    },
    {
      icon: Heart,
      value: "∞",
      label: "Paixão pelo que Faço"
    }
  ];

  const achievements = [
    "Especialista em Linfoterapia",
    "Tratamentos Pós-Operatório",
    "Estética Corporal e Facial",
    "Terapias de Bem-Estar"
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-sage-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-darkgreen-800 mb-6">
            Sobre Mim
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicada a realçar a sua beleza natural com cuidado, técnica e paixão
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-8 h-8 text-sage-600" />
              <h3 className="text-2xl font-bold text-darkgreen-800">Minha História</h3>
            </div>
            
            {aboutContent?.content ? (
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {aboutContent.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  De Salvador – Bahia para Portugal, trago comigo mais de 20 anos de experiência dedicados ao cuidado de pessoas. 
                  Acredito que cada corpo tem uma história única e merece atenção, respeito e presença.
                </p>
                
                <p>
                  Especialista em linfoterapia, pós-operatório e estética, atuo promovendo saúde, recuperação e qualidade de vida. 
                  Meu compromisso é oferecer tratamentos sob medida, alicerçados em conhecimento, sensibilidade e ética profissional.
                </p>

                <p>
                  O toque terapêutico é a minha ferramenta para devolver equilíbrio, bem-estar e autoconfiança aos meus clientes. 
                  Atendimento em ambiente discreto, seguro e acolhedor.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-darkgreen-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-sage-600" />
                Especializações
              </h4>
              <ul className="space-y-2">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4 text-gold-500" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center">
            <LazyImage 
              src="/lovable-uploads/f89fd8e5-45a3-4f6b-878e-d3f162b79dc1.png" 
              alt="Profile Image" 
              className="rounded-2xl shadow-lg border border-sage-200 w-full h-auto max-w-md"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-sage-100">
              <stat.icon className="w-8 h-8 text-sage-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-darkgreen-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-darkgreen-800 mb-4">
            Partilhe a Sua Experiência
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            A sua opinião é muito importante para mim. Partilhe como foi a sua experiência 
            e ajude outras pessoas a conhecer o meu trabalho.
          </p>
          
          <Dialog open={showTestimonialForm} onOpenChange={setShowTestimonialForm}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-sage-600 hover:bg-sage-700 text-white">
                <MessageSquare className="w-5 h-5 mr-2" />
                Enviar Depoimento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <TestimonialForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
