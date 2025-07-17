
import React from 'react';
import { Heart, Globe, Mail, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Footer: React.FC = () => {
  const { data: contactInfo } = useQuery({
    queryKey: ['contact-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: businessHours } = useQuery({
    queryKey: ['business-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .order('day_of_week');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: settings } = useQuery({
    queryKey: ['site-settings-footer'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['company_location', 'company_email']);
      
      if (error) throw error;
      return data;
    }
  });

  const getContactByType = (type: string) => {
    return contactInfo?.find(contact => contact.type === type);
  };

  const getSettingValue = (key: string, fallback: string) => {
    return settings?.find(s => s.key === key)?.value || fallback;
  };

  return (
    <footer className="bg-darkgreen-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Sobre o Negócio */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-sage-100">Cuidados de Beleza</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Especializada em linfoterapia, pós-operatório e estética, oferecendo cuidados de qualidade 
              para realçar a sua beleza natural com técnicas modernas e tratamentos personalizados.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Phone className="w-4 h-4" />
              <span>{getContactByType('phone')?.value || '+351 964 481 966'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Mail className="w-4 h-4" />
              <span>{getContactByType('email')?.value || 'Limadesouzacreusa@gmail.com'}</span>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-sage-100">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="text-gray-300 hover:text-sage-200 transition-colors">Serviços</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-sage-200 transition-colors">Sobre Mim</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-sage-200 transition-colors">FAQ</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-sage-200 transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Horários */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-sage-100">Horários</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex justify-between">
                <span>Segunda à Sexta:</span>
                <span>09:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado:</span>
                <span>09:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo:</span>
                <span className="text-red-400">Fechado</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-darkgreen-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Créditos de Desenvolvimento */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>Desenvolvido com</span>
              <Heart className="w-4 h-4 text-sage-400 fill-current" />
              <span>pela</span>
              <a 
                href="http://sites.casacriativami.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sage-300 hover:text-sage-200 font-medium transition-colors flex items-center gap-1"
              >
                <Globe className="w-4 h-4" />
                Casa Criativa MI
              </a>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500 text-center md:text-right">
              <p>© {new Date().getFullYear()} Todos os direitos reservados</p>
              <p className="mt-1">Soluções digitais profissionais</p>
            </div>
          </div>

          {/* Informação adicional sobre a Casa Criativa MI */}
          <div className="mt-6 pt-6 border-t border-darkgreen-700">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">
                <strong className="text-sage-300">Casa Criativa MI</strong> - Agência especializada em desenvolvimento web e soluções digitais
              </p>
              <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
                <a 
                  href="http://sites.casacriativami.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-sage-300 transition-colors"
                >
                  Website
                </a>
                <span>•</span>
                <a 
                  href="mailto:contato@casacriativami.com" 
                  className="hover:text-sage-300 transition-colors"
                >
                  Contacto
                </a>
                <span>•</span>
                <span>{getSettingValue('company_location', 'Sintra, Portugal')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
