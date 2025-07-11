import React, { useState } from 'react';
import { Phone, Instagram, Flower2, X } from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import { SectionDivider } from '@/components/SectionDivider';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { LocationSection } from '@/components/LocationSection';
import FAQSection from '@/components/FAQSection';
import { createWhatsAppLink, WhatsAppMessages } from '@/utils/whatsapp';

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const whatsappLink = createWhatsAppLink(WhatsAppMessages.general);

  const handleBookingClick = () => {
    window.open(createWhatsAppLink(WhatsAppMessages.consultation), '_blank');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
      {/* Fixed WhatsApp Button - Premium Style */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-darkgreen-600 to-darkgreen-700 hover:from-darkgreen-700 hover:to-darkgreen-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-float"
      >
        <Phone className="h-6 w-6" />
      </a>

      {/* Premium Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-sage-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/new-logo.png" 
                alt="Creusa Lima - Beleza e Estética" 
                className="h-12 w-auto"
              />
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#sobre" className="font-medium text-forest-700 hover:text-darkgreen-700 transition-colors duration-300 relative group font-poppins">
                Sobre
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-darkgreen-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="#servicos" className="font-medium text-forest-700 hover:text-darkgreen-700 transition-colors duration-300 relative group font-poppins">
                Serviços
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-darkgreen-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="#localizacao" className="font-medium text-forest-700 hover:text-darkgreen-700 transition-colors duration-300 relative group font-poppins">
                Localização
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-darkgreen-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="#contato" className="font-medium text-forest-700 hover:text-darkgreen-700 transition-colors duration-300 relative group font-poppins">
                Contato
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-darkgreen-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a 
                href="https://instagram.com/creusalima_estetica" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-forest-700 hover:text-gold-600 transition-colors duration-300 p-2 hover:bg-gold-50 rounded-full"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 text-forest-700 hover:text-darkgreen-700 transition-colors duration-300"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <div className="space-y-1">
                    <div className="w-6 h-0.5 bg-current transition-all duration-300"></div>
                    <div className="w-6 h-0.5 bg-current transition-all duration-300"></div>
                    <div className="w-6 h-0.5 bg-current transition-all duration-300"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          ></div>
          <div className="absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="p-6 pt-20">
              <nav className="space-y-6">
                <a 
                  href="#sobre" 
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-forest-700 hover:text-darkgreen-700 transition-colors duration-300 py-3 border-b border-sage-100 font-poppins"
                >
                  Sobre
                </a>
                <a 
                  href="#servicos" 
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-forest-700 hover:text-darkgreen-700 transition-colors duration-300 py-3 border-b border-sage-100 font-poppins"
                >
                  Serviços
                </a>
                <a 
                  href="#localizacao" 
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-forest-700 hover:text-darkgreen-700 transition-colors duration-300 py-3 border-b border-sage-100 font-poppins"
                >
                  Localização
                </a>
                <a 
                  href="#contato" 
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-forest-700 hover:text-darkgreen-700 transition-colors duration-300 py-3 border-b border-sage-100 font-poppins"
                >
                  Contato
                </a>
                
                <div className="pt-6 space-y-4">
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gradient-to-r from-darkgreen-600 to-darkgreen-700 text-white px-6 py-3 rounded-lg hover:from-darkgreen-700 hover:to-darkgreen-800 transition-all duration-300 font-poppins"
                  >
                    <Phone className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </a>
                  
                  <a 
                    href="https://instagram.com/creusalima_estetica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-3 rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all duration-300 font-poppins"
                  >
                    <Instagram className="h-5 w-5" />
                    <span>Instagram</span>
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection onBookingClick={handleBookingClick} />

      {/* Section Divider */}
      <SectionDivider variant="sage" />

      {/* About Section */}
      <AboutSection onBookingClick={handleBookingClick} />

      {/* Section Divider */}
      <SectionDivider variant="gold" />

      {/* Services Section */}
      <ServicesSection onBookingClick={handleBookingClick} />

      {/* Section Divider */}
      <SectionDivider variant="sage" />

      {/* Location Section */}
      <LocationSection />

      {/* Section Divider */}
      <SectionDivider variant="gold" />

      {/* FAQ Section */}
      <FAQSection />

      {/* Premium Footer */}
      <footer id="contato" className="bg-gradient-to-r from-darkgreen-900 to-darkgreen-800 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="mb-8 flex items-center justify-center">
              <img 
                src="/lovable-uploads/new-logo.png" 
                alt="Creusa Lima - Beleza e Estética" 
                className="h-16 w-auto filter brightness-0 invert"
              />
            </div>
            
            <h3 className="font-tan-mon-cheri text-2xl font-semibold mb-8 text-sage-100">
              Beleza e Estética
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-gold-300 transition-colors duration-300 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 font-poppins"
              >
                <Phone className="h-5 w-5" />
                <span>+351 964 481 966</span>
              </a>
              
              <a 
                href="https://instagram.com/creusalima_estetica"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-gold-300 transition-colors duration-300 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 font-poppins"
              >
                <Instagram className="h-5 w-5" />
                <span>@creusalima_estetica</span>
              </a>
            </div>
            
            <div className="border-t border-darkgreen-700 pt-8">
              <p className="text-sage-200 mb-2 font-poppins">
                © 2024 Creusa Lima - Beleza e Estética. Todos os direitos reservados.
              </p>
              <p className="text-sage-300 text-sm font-poppins mb-2">
                Desenvolvido por <a href="http://sites.casacriativami.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors duration-300 underline">Casa Criativa MI</a>
              </p>
              <p className="text-sage-300 text-sm font-bauer-bodoni">
                Cuidar de você é a nossa missão
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
