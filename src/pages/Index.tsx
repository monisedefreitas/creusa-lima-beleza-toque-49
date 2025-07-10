
import React from 'react';
import { Phone, Instagram, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const whatsappNumber = "+351964481966";
  const whatsappLink = `https://wa.me/351964481966`;

  const services = [
    "Linfoterapia",
    "Drenagem linfática – pré e pós-operatório", 
    "Drenagem linfática oncológica (com autorização médica)",
    "Hifu",
    "Radiofrequência",
    "Cavitação",
    "Depilação à laser",
    "Massagem gestante",
    "Massagens relaxantes com pedras quentes e frias"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <Phone className="h-6 w-6" />
      </a>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-emerald-800">
            CL
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#sobre" className="text-slate-700 hover:text-emerald-700 transition-colors">Sobre</a>
            <a href="#servicos" className="text-slate-700 hover:text-emerald-700 transition-colors">Serviços</a>
            <a href="#localizacao" className="text-slate-700 hover:text-emerald-700 transition-colors">Localização</a>
            <a href="#contato" className="text-slate-700 hover:text-emerald-700 transition-colors">Contato</a>
            <a href="https://instagram.com/creusalima_estetica" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-emerald-700 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </nav>
        </div>
      </header>

      {/* Banner Principal */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-emerald-50 to-white overflow-hidden">
        <div className="absolute top-10 right-10 opacity-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-200 to-yellow-200"></div>
        </div>
        <div className="absolute bottom-10 left-10 opacity-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-200 to-emerald-200"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-serif text-emerald-800 mb-6 leading-tight">
              ✨ Cuidar de você é a minha missão! ✨
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Dos tratamentos mais delicados à tecnologia avançada, cada serviço é feito com carinho, 
              profissionalismo e respeito à sua história.
            </p>
            <Button 
              size="lg" 
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 text-lg"
              onClick={() => window.open(whatsappLink, '_blank')}
            >
              Agende o seu atendimento
            </Button>
          </div>
        </div>
      </section>

      {/* Sobre Mim */}
      <section id="sobre" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-emerald-800 mb-8">
                ✨ Muito gosto, eu sou a Creusa Lima ✨
              </h2>
            </div>
            
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                  <p>
                    Sou de Salvador - Bahia, mas há 7 anos encontrei em Portugal um novo lar. 🌿
                  </p>
                  <p>
                    Há 3 anos decidi empreender e viver com ainda mais propósito o que sempre foi minha paixão: cuidar de pessoas.
                  </p>
                  <p>
                    Sou especializada em Linfoterapia, pós-operatório e bem-estar — porque acredito que cada corpo tem uma história, 
                    e cada pessoa merece ser cuidada com atenção, presença e afeto.
                  </p>
                  <p>
                    Através do toque terapêutico, ajudo a se reconectarem com o seu corpo e com o prazer de se cuidar.
                    Seja numa drenagem, numa massagem relaxante ou num tratamento de beleza, o meu compromisso é o mesmo: 
                    promover saúde, bem-estar e autoestima. 💆🏽‍♀️
                  </p>
                  <p className="text-emerald-700 font-medium">
                    🫶 O toque cura. E uma boa conversa abraça a alma.
                  </p>
                  <p>
                    Se quiser saber mais ou marcar um atendimento, é só me chamar aqui.
                  </p>
                </div>
                
                <div className="mt-8 text-center">
                  <Button 
                    size="lg" 
                    className="bg-emerald-700 hover:bg-emerald-800 text-white"
                    onClick={() => window.open(whatsappLink, '_blank')}
                  >
                    Fale comigo pelo WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20 px-4 bg-gradient-to-br from-emerald-50/50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-emerald-800 mb-4">
              Nossos serviços
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="grid gap-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
                      <span className="text-slate-700">{service}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-yellow-50 rounded-lg text-center">
                  <p className="text-slate-700 mb-4 italic">
                    Cada mulher merece um cuidado único. Quer saber qual tratamento é ideal para si?
                  </p>
                  <p className="text-emerald-700 font-medium">
                    Fale comigo pelo direct ou WhatsApp!<br />
                    Juntas, vamos construir a sua melhor versão. 💚✨
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Localização */}
      <section id="localizacao" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-emerald-800 mb-4">
              Localização
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-serif text-emerald-800 mb-4">
                    Espaço Sinergia
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-slate-700">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <p>Rua Fernando Lopes Graça 379 B, Cascais 2775-571 Carcavelos</p>
                  </div>
                </div>
                
                <div className="w-full h-64 bg-slate-200 rounded-lg flex items-center justify-center">
                  <p className="text-slate-500">Mapa do Google Maps será incorporado aqui</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-emerald-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="text-3xl font-serif font-bold mb-6">CL</div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>+351 964 481 966</span>
              </a>
              
              <a 
                href="https://instagram.com/creusalima_estetica"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span>@creusalima_estetica</span>
              </a>
            </div>
            
            <div className="border-t border-emerald-700 pt-6">
              <p className="text-emerald-200">
                © 2024 Creusa Lima - Beleza e Estética
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
