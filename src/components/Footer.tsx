
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Desenvolvido com</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>pela</span>
            <a 
              href="https://casacriativami.pt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
            >
              Casa Criativa MI
            </a>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            © {new Date().getFullYear()} Todos os direitos reservados
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
