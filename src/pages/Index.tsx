
import React, { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { LocationSection } from "@/components/LocationSection";
import FAQSection from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import SEOManager from "@/components/SEO/SEOManager";
import EnhancedWhatsApp from "@/components/WhatsApp/EnhancedWhatsApp";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const Index = () => {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleBookingClick = () => {
    setShowBookingDialog(true);
  };

  const handleCloseDialog = () => {
    setShowBookingDialog(false);
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

        {/* Booking Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center font-tan-mon-cheri text-2xl text-darkgreen-900">
                Agende a sua Consulta
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-center text-forest-600">
                Entre em contacto connosco para agendar a sua consulta personalizada
              </p>
              <EnhancedWhatsApp />
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="w-full"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Index;
