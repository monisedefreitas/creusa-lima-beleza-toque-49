
import * as React from 'react';
import { Flower2 } from 'lucide-react';

interface SectionDividerProps {
  variant?: 'default' | 'gold' | 'sage';
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ variant = 'default' }) => {
  const getColors = () => {
    switch (variant) {
      case 'gold':
        return {
          line: 'bg-gold-200',
          flower: 'text-gold-500',
          bg: 'bg-gold-50'
        };
      case 'sage':
        return {
          line: 'bg-sage-200',
          flower: 'text-sage-500',
          bg: 'bg-sage-50'
        };
      default:
        return {
          line: 'bg-beige-200',
          flower: 'text-forest-400',
          bg: 'bg-white'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex items-center w-full max-w-md">
        <div className={`flex-1 h-px ${colors.line}`}></div>
        <div className={`mx-6 p-3 rounded-full ${colors.bg} border border-${variant === 'gold' ? 'gold' : variant === 'sage' ? 'sage' : 'beige'}-200`}>
          <Flower2 className={`w-6 h-6 ${colors.flower}`} />
        </div>
        <div className={`flex-1 h-px ${colors.line}`}></div>
      </div>
    </div>
  );
};
