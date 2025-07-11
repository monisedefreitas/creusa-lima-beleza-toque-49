import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Flower2, HelpCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const FAQSection: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "O que é linfoterapia e quais os seus benefícios?",
      answer: "A linfoterapia é uma técnica especializada que estimula o sistema linfático, ajudando a eliminar toxinas, reduzir inchaços e melhorar a circulação. É especialmente benéfica para recuperação pós-operatória, tratamentos oncológicos (com autorização médica) e bem-estar geral."
    },
    {
      question: "Os tratamentos são dolorosos?",
      answer: "Nossos tratamentos são desenvolvidos para serem confortáveis e relaxantes. Utilizamos técnicas suaves e equipamentos de última geração que garantem eficácia sem desconforto. Sempre adaptamos a intensidade às suas necessidades e sensibilidade."
    },
    {
      question: "Quantas sessões são necessárias para ver resultados?",
      answer: "O número de sessões varia conforme o tratamento e objetivo individual. Na consulta inicial, fazemos uma avaliação personalizada e criamos um plano de tratamento adequado às suas necessidades específicas."
    },
    {
      question: "Posso fazer tratamentos durante a gravidez?",
      answer: "Sim! Oferecemos massagens especializadas para gestantes, sempre com técnicas seguras e adaptadas a cada fase da gravidez. É importante informar sobre a gestação durante o agendamento para prepararmos o atendimento adequado."
    },
    {
      question: "Como funciona o agendamento?",
      answer: "O agendamento é feito através do WhatsApp ou telefone. Oferecemos horários flexíveis para se adequar à sua rotina. Recomendamos agendar com antecedência para garantir a disponibilidade no horário desejado."
    },
    {
      question: "Há estacionamento disponível?",
      answer: "Sim, o Espaço Sinergia oferece fácil acesso e estacionamento disponível. Localizado em Carcavelos, também temos acesso fácil por transporte público (metro e autocarro)."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-sage-50/50 to-beige-50/30">
      <div className="container mx-auto max-w-4xl">
        <div 
          ref={elementRef}
          className={`text-center mb-16 transition-all duration-800 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border border-sage-200 mb-6">
            <HelpCircle className="w-4 h-4 text-sage-500" />
            <span className="text-sm font-medium text-darkgreen-800 font-bauer-bodoni">Dúvidas Frequentes</span>
          </div>
          
          <h2 className="font-tan-mon-cheri text-4xl md:text-5xl font-bold text-darkgreen-900 mb-6">
            Perguntas & Respostas
          </h2>
          <p className="font-poppins text-xl text-forest-600 max-w-3xl mx-auto leading-relaxed">
            Esclareça suas dúvidas sobre nossos tratamentos e serviços
          </p>
        </div>

        <Card className={`border-0 shadow-xl bg-white/90 backdrop-blur-sm transition-all duration-800 ${
          isVisible ? 'animate-scale-in animate-delay-300' : 'opacity-0 scale-95'
        }`}>
          <CardContent className="p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-sage-100 rounded-lg px-6 py-2 hover:shadow-md transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-poppins font-medium text-darkgreen-900 hover:text-darkgreen-700 py-4">
                    <div className="flex items-center gap-3">
                      <Flower2 className="w-4 h-4 text-sage-500 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-forest-600 font-poppins leading-relaxed pt-2 pb-4 pl-7">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 p-6 bg-gradient-to-r from-sage-50 to-beige-50 rounded-lg text-center border border-sage-200">
              <p className="text-forest-700 font-poppins mb-2">
                Não encontrou a resposta que procurava?
              </p>
              <p className="text-sm text-forest-600 font-poppins">
                Entre em contacto connosco pelo WhatsApp para esclarecimentos personalizados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FAQSection;