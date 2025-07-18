
import * as React from 'react';
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/WhatsApp/FloatingWhatsApp';
import ScrollToTop from '@/components/Performance/ScrollToTop';
import SEOManager from '@/components/SEO/SEOManager';
import SkipLinks from '@/components/Accessibility/SkipLinks';
import { SectionDivider } from '@/components/SectionDivider';

const Index: React.FC = () => {
  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered: ', registration);
        } catch (registrationError) {
          console.log('SW registration failed: ', registrationError);
        }
      });
    }
  }, []);

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
        
        <section id="testimonials">
          <TestimonialsSection />
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
      <ScrollToTop />
    </div>
  );
};

export default Index;
