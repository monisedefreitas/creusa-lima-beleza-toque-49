
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Início', href: '#hero' },
    { label: 'Sobre', href: '#about' },
    { label: 'Serviços', href: '#services' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contacto', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMenuOpen(false);
  };

  const handleAdminAccess = () => {
    if (user && isAdmin) {
      navigate('/admin');
    } else {
      navigate('/auth', { state: { from: { pathname: '/admin' } } });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/new-logo.png" 
              alt="Creusa Lima" 
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-700 hover:text-darkgreen-800 font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
            
            {/* Admin Access Button */}
            {(user && isAdmin) && (
              <Button
                onClick={handleAdminAccess}
                variant="outline"
                className="border-darkgreen-800 text-darkgreen-800 hover:bg-darkgreen-800 hover:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            
            <Button
              onClick={() => scrollToSection('#contact')}
              className="bg-darkgreen-800 hover:bg-darkgreen-900 text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              Marcar Consulta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-darkgreen-800 hover:bg-gray-50 w-full text-left rounded-md"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Admin Access Button Mobile */}
              {(user && isAdmin) && (
                <Button
                  onClick={handleAdminAccess}
                  variant="outline"
                  className="w-full mt-2 border-darkgreen-800 text-darkgreen-800 hover:bg-darkgreen-800 hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Painel Admin
                </Button>
              )}
              
              <Button
                onClick={() => scrollToSection('#contact')}
                className="w-full mt-2 bg-darkgreen-800 hover:bg-darkgreen-900 text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                Marcar Consulta
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
