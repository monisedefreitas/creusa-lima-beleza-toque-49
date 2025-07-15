
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-darkgreen-900 to-darkgreen-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="font-tan-mon-cheri text-2xl font-bold text-gold-300 mb-4">
              Creusa Lima
            </h3>
            <p className="font-poppins text-sage-200 leading-relaxed mb-4">
              20+ anos promovendo saúde, bem-estar e autoestima através do toque terapêutico e estética avançada.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/creusalima_estetica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gold-600 hover:bg-gold-700 rounded-full transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/creusalima.estetica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gold-600 hover:bg-gold-700 rounded-full transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bauer-bodoni text-lg font-semibold text-gold-300 mb-4">
              Contacto
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-sage-300 mt-1 flex-shrink-0" />
                <div className="font-poppins text-sm text-sage-200">
                  <p>+351 XXX XXX XXX</p>
                  <p className="text-xs text-sage-300">WhatsApp disponível</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-sage-300 mt-1 flex-shrink-0" />
                <p className="font-poppins text-sm text-sage-200">
                  creusa.lima@email.com
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sage-300 mt-1 flex-shrink-0" />
                <p className="font-poppins text-sm text-sage-200">
                  Lisboa, Portugal
                </p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bauer-bodoni text-lg font-semibold text-gold-300 mb-4">
              Serviços
            </h4>
            <ul className="space-y-2 font-poppins text-sm text-sage-200">
              <li className="hover:text-gold-300 transition-colors cursor-pointer">
                Linfoterapia
              </li>
              <li className="hover:text-gold-300 transition-colors cursor-pointer">
                Drenagem Linfática
              </li>
              <li className="hover:text-gold-300 transition-colors cursor-pointer">
                Pós-Operatório
              </li>
              <li className="hover:text-gold-300 transition-colors cursor-pointer">
                Radiofrequência
              </li>
              <li className="hover:text-gold-300 transition-colors cursor-pointer">
                Massagens Terapêuticas
              </li>
            </ul>
          </div>

          {/* Schedule */}
          <div>
            <h4 className="font-bauer-bodoni text-lg font-semibold text-gold-300 mb-4">
              Horários
            </h4>
            <div className="space-y-2 font-poppins text-sm text-sage-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sage-300" />
                <div>
                  <p>Segunda - Sexta</p>
                  <p className="text-xs text-sage-300">09:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sage-300" />
                <div>
                  <p>Sábado</p>
                  <p className="text-xs text-sage-300">09:00 - 17:00</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-gold-900/30 rounded-lg">
                <p className="text-xs text-gold-200 font-medium">
                  Atendimento por marcação prévia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-sage-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-poppins text-sm text-sage-300">
              © 2024 Creusa Lima - Especialista em Estética. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 font-poppins text-xs text-sage-400">
              <a href="#" className="hover:text-gold-300 transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-gold-300 transition-colors">
                Termos de Serviço
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
