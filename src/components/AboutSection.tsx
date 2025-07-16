
import React, { useState } from 'react';
import { 
  User, 
  Heart, 
  Star, 
  Award, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Users,
  Target,
  Zap,
  Calendar
} from 'lucide-react';
import LazyImage from '@/components/Performance/LazyImage';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const AboutSection: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const achievements = [
    { icon: User, count: 350, label: 'Clientes Felizes' },
    { icon: Heart, count: 98, label: 'Recomendações' },
    { icon: Star, count: 4.9, label: 'Avaliação Média' },
    { icon: Award, count: 12, label: 'Anos de Experiência' },
  ];

  return (
    <section 
      id="about" 
      className="py-20 bg-gradient-to-br from-pink-50 to-purple-50 relative overflow-hidden"
      ref={elementRef}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Sobre Mim</h2>
          <p className="text-gray-600 text-lg">
            Uma paixão por realçar a beleza natural e promover o bem-estar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content with image */}
          <div className={`relative ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <LazyImage 
              src="/images/profile.jpg" 
              alt="Profile Image" 
              className="rounded-2xl shadow-lg border border-pink-100 w-full h-auto"
            />
          </div>
          
          {/* Right content */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
            {/* Introduction */}
            <div className="space-y-4">
              <h3 className="text-3xl font-semibold text-gray-900">
                A sua jornada para a beleza e bem-estar começa aqui.
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Com anos de experiência, dedico-me a oferecer tratamentos personalizados que atendem às suas necessidades individuais. 
                Cada serviço é projetado para realçar a sua beleza natural e promover o seu bem-estar geral.
              </p>
            </div>
            
            {/* Specialties */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900">Especialidades</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-pink-500 h-5 w-5" />
                  <span>Tratamentos Faciais Personalizados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-pink-500 h-5 w-5" />
                  <span>Massagens Relaxantes e Terapêuticas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-pink-500 h-5 w-5" />
                  <span>Soluções Avançadas para a Pele</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-pink-500 h-5 w-5" />
                  <span>Bem-estar Holístico</span>
                </div>
              </div>
            </div>
            
            {/* Achievements */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-md border border-pink-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-2">
                    <achievement.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{achievement.count}</div>
                  <div className="text-gray-600">{achievement.label}</div>
                </div>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-100">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Pronta para se Sentir Radiante?
                </h3>
                <p className="text-gray-600">
                  Descubra os nossos tratamentos personalizados e agende a sua consulta hoje mesmo.
                </p>
                <button
                  onClick={scrollToServices}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Ver os Nossos Serviços
                </button>
                <p className="text-sm text-gray-500">
                  Clique para ver todos os tratamentos disponíveis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Agendar Consulta</h3>
            <p className="text-gray-600 mb-6">
              Para agendar a sua consulta, por favor contacte-nos através do WhatsApp.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  window.open('https://wa.me/351123456789?text=Olá! Gostaria de agendar uma consulta.', '_blank');
                  setIsBookingModalOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Contactar WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutSection;
