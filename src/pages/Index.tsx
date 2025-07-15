
import React, { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { LocationSection } from "@/components/LocationSection";
import FAQSection from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import SEOManager from "@/components/SEO/SEOManager";
import BookingModal from "@/components/BookingSystem/BookingModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const Index = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleBookingClick = () => {
    // Booking functionality is now handled by the BookingModal component
  };

  return (
    <>
      <SEOManager />
      <div className="min-h-screen bg-white">
        {/* Admin Access Button */}
        {user && isAdmin && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>
        )}

        {/* Auth Button for non-logged users */}
        {!user && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
            >
              Entrar
            </Button>
          </div>
        )}

        <main id="main-content">
          <HeroSection onBookingClick={handleBookingClick} />
          <AboutSection onBookingClick={handleBookingClick} />
          <ServicesSection onBookingClick={handleBookingClick} />
          <LocationSection />
          <FAQSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
