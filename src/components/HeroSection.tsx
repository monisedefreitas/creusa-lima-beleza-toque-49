
import React from "react";
import { Button } from "@/components/ui/button";
import BookingModal from "@/components/BookingSystem/BookingModal";

interface HeroSectionProps {
  onBookingClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookingClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-sage-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/f82463a1-3344-4535-86dd-071e92421715.png')] bg-cover bg-center bg-no-repeat opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/new-logo.png" 
              alt="Creusa Lima - Medicina Estética" 
              className="mx-auto h-32 w-auto"
            />
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-darkgreen-900 mb-6 leading-tight">
            <span className="font-tan-mon-cheri">Medicina Estética</span>
            <br />
            <span className="text-sage-700 text-3xl md:text-4xl lg:text-5xl">
              com excelência e cuidado
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-forest-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Descubra a sua melhor versão com tratamentos personalizados de medicina estética, 
            realizados pela Dra. Creusa Lima com mais de 15 anos de experiência.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <BookingModal>
              <Button 
                size="lg" 
                className="bg-darkgreen-800 hover:bg-darkgreen-900 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Agendar Consulta
              </Button>
            </BookingModal>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-darkgreen-800 text-darkgreen-800 hover:bg-darkgreen-800 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Nossos Serviços
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-darkgreen-800 mb-2">15+</div>
              <div className="text-forest-600">Anos de Experiência</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-darkgreen-800 mb-2">1000+</div>
              <div className="text-forest-600">Pacientes Satisfeitos</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-darkgreen-800 mb-2">100%</div>
              <div className="text-forest-600">Segurança e Qualidade</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-darkgreen-800 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-darkgreen-800 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
