
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Award, 
  Users, 
  Clock,
  CheckCircle,
  Calendar
} from 'lucide-react';
import LazyImage from '@/components/Performance/LazyImage';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const AboutSection: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation();
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);

  const features = [
    {
      icon: Heart,
      title: 'Cuidado Personalizado',
      description: 'Cada tratamento é adaptado às suas necessidades específicas'
    },
    {
      icon: Award,
      title: 'Experiência Comprovada',
      description: 'Mais de 15 anos de experiência em medicina natural'
    },
    {
      icon: Users,
      title: 'Milhares de Clientes',
      description: 'Mais de 1000 pessoas já transformaram a sua saúde'
    },
    {
      icon: Clock,
      title: 'Resultados Duradouros',
      description: 'Foco em soluções sustentáveis e de longo prazo'
    }
  ];

  const achievements = [
    'Formação em Medicina Natural e Terapias Complementares',
    'Especialização em Fitoterapia e Aromaterapia',
    'Certificação em Medicina Tradicional Chinesa',
    'Membro da Associação Portuguesa de Medicina Natural'
  ];

  return (
    <section ref={elementRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <div className={`relative ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
            <div className="relative">
              <LazyImage
                src="/lovable-uploads/73d8cd7b-d053-484a-b84e-0c423886228f.png"
                alt="Creusa Lima no seu consultório"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
              
              {/* Experience Badge */}
              <div className="absolute top-6 right-6 bg-darkgreen-800 text-white p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm">Anos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <div className="space-y-4">
              <div className="text-darkgreen-800 font-semibold text-lg">
                Sobre Mim
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Olá, sou{' '}
                <span className="text-darkgreen-800">Creusa Lima</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Há mais de 15 anos dedico-me à medicina natural e terapias complementares, 
                ajudando pessoas a encontrar o equilíbrio e bem-estar através de tratamentos 
                naturais e personalizados.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                A minha missão é proporcionar cuidados de saúde holísticos que respeitam 
                a individualidade de cada pessoa, promovendo a cura natural e o bem-estar 
                duradouro sem dependência de medicamentos químicos.
              </p>
            </div>

            {/* Achievements */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Formações e Certificações
              </h3>
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-darkgreen-800 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{achievement}</span>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-darkgreen-800" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => setIsBookingModalOpen(true)}
              size="lg"
              className="bg-darkgreen-800 hover:bg-darkgreen-900 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Agendar Consulta
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Agendar Consulta</h3>
            <p className="text-gray-600 mb-4">
              Para agendar a sua consulta, por favor contacte-nos através do WhatsApp ou telefone.
            </p>
            <Button
              onClick={() => setIsBookingModalOpen(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutSection;
