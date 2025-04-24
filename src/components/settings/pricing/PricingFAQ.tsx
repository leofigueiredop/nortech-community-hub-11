
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const PricingFAQ: React.FC = () => {
  return (
    <div className="mt-12 max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Perguntas Frequentes</h3>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border rounded-lg mb-3 px-4">
          <AccordionTrigger>Qual plano é ideal para mim?</AccordionTrigger>
          <AccordionContent>
            Para comunidades iniciantes, o plano <strong>Starter</strong> é uma boa opção. 
            Se você está sério sobre crescer sua comunidade, o plano <strong>Professional</strong> oferece as ferramentas essenciais. 
            Para funcionalidades avançadas, considere o <strong>Business</strong> ou <strong>Enterprise</strong>.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="border rounded-lg mb-3 px-4">
          <AccordionTrigger>Posso mudar de plano depois?</AccordionTrigger>
          <AccordionContent>
            Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
            Ao fazer upgrade, você terá acesso instantâneo às novas funcionalidades.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3" className="border rounded-lg mb-3 px-4">
          <AccordionTrigger>Como funciona o plano Enterprise?</AccordionTrigger>
          <AccordionContent>
            O plano Enterprise oferece uma solução completa com recursos avançados, 
            suporte prioritário e flexibilidade máxima. Entre em contato com nossa equipe 
            para uma proposta personalizada.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PricingFAQ;
