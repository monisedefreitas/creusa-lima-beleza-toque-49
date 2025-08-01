
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order_index: number | null;
}

const FAQSection: React.FC = () => {
  const { data: faqs, isLoading, error } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      console.log('Fetching FAQs...');
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) {
        console.error('Error fetching FAQs:', error);
        throw error;
      }
      
      console.log('FAQs fetched:', data);
      return data as FAQ[];
    }
  });

  if (isLoading) {
    return (
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-darkgreen-900 mb-4">
              Perguntas Frequentes
            </h2>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('FAQ Error:', error);
    return (
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-darkgreen-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-gray-600">
              Erro ao carregar as perguntas frequentes. Tente novamente mais tarde.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-darkgreen-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-gray-600">
              Nenhuma pergunta frequente disponível no momento.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-darkgreen-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-gray-600">
            Encontre respostas para as dúvidas mais comuns sobre os nossos serviços
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id}
              className="border border-sage-200 rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-darkgreen-900 pr-4">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed pb-6 pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
