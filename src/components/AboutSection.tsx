
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, Shield, Users } from "lucide-react";
import BookingModal from "@/components/BookingSystem/BookingModal";

interface AboutSectionProps {
  onBookingClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onBookingClick }) => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Column */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/f89fd8e5-45a3-4f6b-878e-d3f162b79dc1.png" 
                  alt="Dra. Creusa Lima - Medicina Estética" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-sage-200 rounded-full opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-sage-100 rounded-full opacity-40"></div>
            </div>
            
            {/* Content Column */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-darkgreen-900 mb-6">
                  <span className="font-tan-mon-cheri">Dra. Creusa Lima</span>
                </h2>
                <p className="text-lg text-forest-600 leading-relaxed mb-6">
                  Com mais de 15 anos de experiência em medicina estética, a Dra. Creusa Lima 
                  dedica-se a proporcionar tratamentos seguros e eficazes, sempre respeitando 
                  a naturalidade e harmonia facial de cada paciente.
                </p>
                <p className="text-lg text-forest-600 leading-relaxed">
                  Especializada em harmonização facial, preenchimentos e procedimentos anti-aging, 
                  combina técnicas avançadas com um olhar artístico único para realçar a beleza 
                  natural de cada pessoa.
                </p>
              </div>
              
              {/* Qualifications Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-sage-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Award className="h-8 w-8 text-darkgreen-800 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-darkgreen-900">Certificada</div>
                    <div className="text-xs text-forest-600">Ordem dos Médicos</div>
                  </CardContent>
                </Card>
                
                <Card className="border-sage-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 text-darkgreen-800 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-darkgreen-900">Cuidado</div>
                    <div className="text-xs text-forest-600">Personalizado</div>
                  </CardContent>
                </Card>
                
                <Card className="border-sage-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 text-darkgreen-800 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-darkgreen-900">Segurança</div>
                    <div className="text-xs text-forest-600">Máxima</div>
                  </CardContent>
                </Card>
                
                <Card className="border-sage-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-darkgreen-800 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-darkgreen-900">1000+</div>
                    <div className="text-xs text-forest-600">Pacientes</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* CTA Button */}
              <BookingModal>
                <Button 
                  size="lg" 
                  className="bg-darkgreen-800 hover:bg-darkgreen-900 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Agendar Consulta Personalizada
                </Button>
              </BookingModal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
