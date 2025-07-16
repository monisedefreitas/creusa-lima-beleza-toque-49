
import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Estética & Bem-estar
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Transformando vidas através da beleza e do bem-estar. 
              Cada tratamento é uma experiência única de renovação e autoestima.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-400">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 text-pink-400" />
                <span>Rua da Beleza, 123<br />4000-000 Porto</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-pink-400" />
                <span>+351 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-pink-400" />
                <span>info@estetica.pt</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-400">Horários</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-pink-400" />
                <div>
                  <p className="font-medium">Segunda - Sexta</p>
                  <p>09:00 - 19:00</p>
                </div>
              </div>
              <div className="ml-8">
                <p className="font-medium">Sábado</p>
                <p>09:00 - 17:00</p>
              </div>
              <div className="ml-8">
                <p className="font-medium">Domingo</p>
                <p>Fechado</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-400">Serviços</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-pink-400 transition-colors cursor-pointer">Limpeza de Pele</li>
              <li className="hover:text-pink-400 transition-colors cursor-pointer">Tratamentos Faciais</li>
              <li className="hover:text-pink-400 transition-colors cursor-pointer">Massagens</li>
              <li className="hover:text-pink-400 transition-colors cursor-pointer">Depilação</li>
              <li className="hover:text-pink-400 transition-colors cursor-pointer">Manicure & Pedicure</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2024 Estética & Bem-estar. Todos os direitos reservados.
          </div>
          
          {/* Site Authorship */}
          <div className="text-gray-400 text-sm">
            Site desenvolvido por{' '}
            <a 
              href="http://sites.casacriativami.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors font-medium"
            >
              Casa Criativa MI
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
