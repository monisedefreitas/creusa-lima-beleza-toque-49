
import React from 'react';
import { Phone, Instagram, Sparkles } from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import { SectionDivider } from '@/components/SectionDivider';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { LocationSection } from '@/components/LocationSection';

const Index = () => {
  const whatsappNumber = "+351964481966";
  const whatsappLink = `https://wa.me/351964481966`;

  const handleBookingClick = () => {
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Fixed WhatsApp Button - Premium Style */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-float"
      >
        <Phone className="h-6 w-6" />
      </a>

      {/* Premium Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="font-playfair text-3xl font-bold text-emerald-800 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-gold-500" />
              CL
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#sobre" className="font-medium text-slate-700 hover:text-emerald-700 transition-colors duration-300 relative group">
                Sobre
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="#servicos" className="font-medium text-slate-700 hover:text-emerald-700 transition-colors duration-300 relative group">
                Serviços
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="#localizacao" className="font-medium text-slate-700 hover:text-emerald-700 transition-colors duration-300 relative group">
                Localização
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="#contato" className="font-medium text-slate-700 hover:text-emerald-700 transition-colors duration-300 relative group">
                Contato
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a 
                href="https://instagram.com/creusalima_estetica" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-700 hover:text-gold-600 transition-colors duration-300 p-2 hover:bg-gold-50 rounded-full"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="p-2 text-slate-700 hover:text-emerald-700">
                <div className="space-y-1">
                  <div className="w-6 h-0.5 bg-current"></div>
                  <div className="w-6 h-0.5 bg-current"></div>
                  <div className="w-6 h-0.5 bg-current"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection onBookingClick={handleBookingClick} />

      {/* Section Divider */}
      <SectionDivider variant="emerald" />

      {/* About Section */}
      <AboutSection onBookingClick={handleBookingClick} />

      {/* Section Divider */}
      <SectionDivider variant="gold" />

      {/* Services Section */}
      <ServicesSection onBookingClick={handleBookingClick} />

      {/* Section Divider */}
      <SectionDivider variant="emerald" />

      {/* Location Section */}
      <LocationSection />

      {/* Premium Footer */}
      <footer id="contato" className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="font-playfair text-4xl font-bold mb-8 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-gold-400" />
              CL
            </div>
            
            <h3 className="font-playfair text-2xl font-semibold mb-8 text-emerald-100">
              Beleza e Estética Premium
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-gold-300 transition-colors duration-300 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20"
              >
                <Phone className="h-5 w-5" />
                <span>+351 964 481 966</span>
              </a>
              
              <a 
                href="https://instagram.com/creusalima_estetica"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-gold-300 transition-colors duration-300 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20"
              >
                <Instagram className="h-5 w-5" />
                <span>@creusalima_estetica</span>
              </a>
            </div>
            
            <div className="border-t border-emerald-700 pt-8">
              <p className="text-emerald-200 mb-2">
                © 2024 Creusa Lima - Beleza e Estética Premium
              </p>
              <p className="text-emerald-300 text-sm">
                ✨ Cuidar de você é a nossa missão ✨
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
