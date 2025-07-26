
import * as React from 'react';

const SkipLinks: React.FC = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-4 left-4 z-50 bg-darkgreen-800 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-all"
      >
        Saltar para o conteúdo principal
      </a>
      <a
        href="#navigation"
        className="absolute top-4 left-32 z-50 bg-darkgreen-800 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-all"
      >
        Saltar para a navegação
      </a>
    </div>
  );
};

export default SkipLinks;
