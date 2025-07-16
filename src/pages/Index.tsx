
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import FAQSection from '@/components/FAQSection';
import LocationSection from '@/components/LocationSection';
import { Footer } from '@/components/Footer';
import GallerySection from '@/components/Gallery/GallerySection';
import FloatingWhatsApp from '@/components/WhatsApp/FloatingWhatsApp';
import SEOManager from '@/components/SEO/SEOManager';
import SkipLinks from '@/components/Accessibility/SkipLinks';
import { SectionDivider } from '@/components/SectionDivider';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
      <SEOManager />
      <SkipLinks />
      <Navigation />
      
      <main className="pt-16">
        <section id="hero">
          <HeroSection />
        </section>
        
        <SectionDivider />
        
        <section id="about">
          <AboutSection />
        </section>
        
        <SectionDivider />
        
        <section id="services">
          <ServicesSection />
        </section>
        
        <SectionDivider />
        
        <section id="gallery">
          <GallerySection />
        </section>
        
        <SectionDivider />
        
        <section id="faq">
          <FAQSection />
        </section>
        
        <SectionDivider />
        
        <section id="contact">
          <LocationSection />
        </section>
      </main>
      
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
