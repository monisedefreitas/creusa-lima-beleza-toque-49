
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Flower2, Heart, Zap, Shield, Phone, Instagram } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ServiceCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  services: string[];
  highlight?: boolean;
}

interface ServicesSectionProps {
  onBookingClick: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookingClick }) => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  const { elementRef: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  const serviceCategories: ServiceCategory[] = [
    {
      title: "Linfoterapia Especializada",
      description: "Tratamentos terapêuticos especializados para sua saúde e bem-estar",
      icon: <Heart className="w-8 h-8 text-sage-600" />,
      services: [
        "Linfoterapia",
        "Drenagem linfática – pré e pós-operatório", 
        "Drenagem linfática oncológica (com autorização médica)"
      ],
      highlight: true
    },
    {
      title: "Tecnologia Avançada",
      description: "Equipamentos de última geração para resultados excepcionais",
      icon: <Zap className="w-8 h-8 text-gold-600" />,
      services: [
        "Hifu",
        "Radiofrequência",
        "Cavitação",
        "Depilação à laser"
      ]
    },
    {
      title: "Cuidados Especiais",
      description: "Tratamentos delicados para momentos únicos da sua vida",
      icon: <Shield className="w-8 h-8 text-forest-600" />,
      services: [
        "Massagem gestante",
        "Massagens relaxantes com pedras quentes e frias"
      ]
    }
  ];

  const handleInstagramClick = () => {
    window.open('https://instagram.com/creusalima_estetica', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="servicos" className="py-20 px-4 bg-gradient-to-br from-beige-50 to-sage-50/30">
      <div className="container mx-auto">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-800 ${
            headerVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border border-sage-200 mb-6">
            <Flower2 className="w-4 h-4 text-sage-500" />
            <span className="text-sm font-medium text-darkgreen-800 font-bauer-bodoni">Excelência em Cada Detalhe</span>
          </div>
          
          <h2 className="font-tan-mon-cheri text-4xl md:text-5xl font-bold text-darkgreen-900 mb-6">
            Nossos Serviços
          </h2>
          <p className="font-poppins text-xl text-forest-600 max-w-3xl mx-auto leading-relaxed">
            Cada tratamento é personalizado e executado com a mais alta qualidade e cuidado
          </p>
        </div>
        
        <div 
          ref={cardsRef}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {serviceCategories.map((category, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover-lift ${
                cardsVisible ? `animate-fade-in-up animate-delay-${index * 100 + 100}` : 'opacity-0 translate-y-8'
              } ${
                category.highlight 
                  ? 'ring-2 ring-gold-200 shadow-xl transform hover:scale-105' 
                  : 'hover:transform hover:scale-105'
              }`}
            >
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className={`inline-flex p-4 rounded-full mb-4 ${
                    category.highlight 
                      ? 'bg-gradient-to-br from-gold-100 to-sage-100' 
                      : 'bg-gradient-to-br from-sage-100 to-beige-100'
                  }`}>
                    {category.icon}
                  </div>
                  <h3 className="font-tan-mon-cheri text-2xl font-semibold text-darkgreen-900 mb-3">
                    {category.title}
                  </h3>
                  <p className="font-poppins text-forest-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>
                
                <div className="space-y-3">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-sage-500 mt-0.5 flex-shrink-0" />
                      <span className="font-poppins text-forest-700 leading-relaxed">{service}</span>
                    </div>
                  ))}
                </div>
                
                {category.highlight && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-gold-50 to-sage-50 rounded-lg text-center border border-gold-200">
                    <p className="text-sm font-medium text-darkgreen-800 font-bauer-bodoni">
                      <Flower2 className="w-4 h-4 inline mr-1" />
                      Especialidade da Casa
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Banner destacado "Cada pessoa merece um cuidado único" */}
        <div 
          ref={ctaRef}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className={`border-0 shadow-2xl bg-gradient-to-r from-darkgreen-900 via-darkgreen-800 to-darkgreen-900 text-white overflow-hidden relative transition-all duration-800 ${
            ctaVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
          }`}>
            <CardContent className="p-12 text-center relative">
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-darkgreen-900/90 to-darkgreen-800/90"></div>
              <div className="absolute top-4 right-4 opacity-20">
                <Flower2 className="w-16 h-16" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-20">
                <Heart className="w-12 h-12" />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
                <div className="w-64 h-64 rounded-full border-2 border-gold-300"></div>
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-gold-500/20 backdrop-blur-sm px-6 py-2 rounded-full border border-gold-300/30 mb-6">
                  <Heart className="w-4 h-4 text-gold-300" />
                  <span className="text-sm font-medium text-gold-200 font-bauer-bodoni">Filosofia de Cuidado</span>
                </div>
                
                <h3 className="font-tan-mon-cheri text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  Cada pessoa merece um{' '}
                  <span className="text-gold-300 relative">
                    cuidado único
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 to-gold-400 rounded"></div>
                  </span>
                </h3>
                
                <p className="font-poppins text-xl text-sage-100 mb-8 leading-relaxed max-w-3xl mx-auto">
                  Quer saber qual tratamento é o mais indicado para si?<br />
                  <span className="text-gold-300 font-medium text-2xl">
                    Entre em contacto e receba uma avaliação personalizada.
                  </span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-darkgreen-900 hover:bg-gold-50 px-8 py-4 text-lg font-medium font-bauer-bodoni rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={onBookingClick}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Entre em Contacto
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-medium font-bauer-bodoni rounded-xl transition-all duration-300 transform hover:scale-105"
                    onClick={handleInstagramClick}
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Veja no Instagram
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
