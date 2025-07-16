
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

const AboutSection: React.FC = () => {
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Clientes Satisfeitos"
    },
    {
      icon: Calendar,
      value: "3+",
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
    "Formação em Estética e Cosmética",
    "Especialização em Tratamentos Faciais",
    "Certificação em Microagulhamento",
    "Curso Avançado de Limpeza de Pele"
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Sobre Mim
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicada a realçar a sua beleza natural com cuidado, técnica e paixão
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-8 h-8 text-pink-600" />
              <h3 className="text-2xl font-bold text-gray-800">Minha História</h3>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              Olá! Sou apaixonada pela arte de cuidar da pele e realçar a beleza natural de cada pessoa. 
              Com mais de 3 anos de experiência na área da estética, dedico-me a proporcionar tratamentos 
              personalizados que vão além da beleza exterior.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              Acredito que cada cliente é único e merece um cuidado especial. Por isso, 
              invisto constantemente em formação e nas melhores técnicas para garantir 
              resultados excepcionais e uma experiência relaxante.
            </p>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-pink-600" />
                Formações e Certificações
              </h4>
              <ul className="space-y-2">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
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
              className="rounded-2xl shadow-lg border border-pink-100 w-full h-auto max-w-md"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <stat.icon className="w-8 h-8 text-pink-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Partilhe a Sua Experiência
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            A sua opinião é muito importante para mim. Partilhe como foi a sua experiência 
            e ajude outras pessoas a conhecer o meu trabalho.
          </p>
          
          <Dialog open={showTestimonialForm} onOpenChange={setShowTestimonialForm}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
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
