
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BillingToggles from './BillingToggles';
import PlanCard from './PlanCard';
import PricingFAQ from './PricingFAQ';
import { ComparisonDialog } from './ComparisonDialog';

export type Plan = {
  id: number;
  name: string;
  monthlyPrice: number | string;
  yearlyPrice?: number;
  description: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  custom?: boolean;
};

const PricingPlans = () => {
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('USD');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [comparisonOpen, setComparisonOpen] = useState(false);
  
  const plans: Plan[] = [
    {
      id: 1,
      name: 'Starter',
      monthlyPrice: 'Free',
      description: 'Para comunidades pequenas',
      features: [
        'Até 100 membros',
        'Conteúdo básico',
        'Fóruns e discussões',
        'Suporte comunitário'
      ],
      cta: 'Começar agora'
    },
    {
      id: 2,
      name: 'Professional',
      monthlyPrice: 89,
      yearlyPrice: 962,
      description: 'Para criadores em crescimento',
      features: [
        'Até 1.000 membros',
        'Cursos, lives e salas',
        'Analytics, afiliados',
        'Branding personalizado'
      ],
      cta: 'Assinar agora',
      recommended: true
    },
    {
      id: 3,
      name: 'Business',
      monthlyPrice: 199,
      yearlyPrice: 2149,
      description: 'Para comunidades estabelecidas',
      features: [
        'Até 10.000 membros',
        'API de membros',
        'Workflows e notificações',
        'Transcrição, campos de perfil'
      ],
      cta: 'Expandir comunidade'
    },
    {
      id: 4,
      name: 'Enterprise',
      monthlyPrice: 360,
      yearlyPrice: 3888,
      description: 'Para grandes comunidades',
      features: [
        'Membros ilimitados',
        'Agentes IA',
        'SSO, moderadores ilimitados',
        'Sandbox, onboarding VIP'
      ],
      cta: 'Plano completo'
    },
    {
      id: 5,
      name: 'White-label',
      monthlyPrice: 'Consultar',
      description: 'Solução customizada',
      features: [
        'App próprio e domínio',
        'Integrações corporativas',
        'Time de sucesso dedicado',
        'Customização completa'
      ],
      cta: 'Falar com o time',
      custom: true
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Escolha o plano ideal para sua comunidade</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Comece com o que faz sentido hoje e evolua com a gente.
        </p>
        
        <BillingToggles 
          currency={currency}
          billingPeriod={billingPeriod}
          setCurrency={setCurrency}
          setBillingPeriod={setBillingPeriod}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            name={plan.name}
            monthlyPrice={plan.monthlyPrice}
            yearlyPrice={plan.yearlyPrice}
            description={plan.description}
            features={plan.features}
            cta={plan.cta}
            recommended={plan.recommended}
            billingPeriod={billingPeriod}
            currency={currency}
            currentPlan={plan.id === 2}
          />
        ))}
      </div>
      
      <div className="flex justify-center mb-12">
        <Button 
          onClick={() => setComparisonOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Comparar Planos
        </Button>
      </div>
      
      <ComparisonDialog open={comparisonOpen} setOpen={setComparisonOpen} plans={plans} />
      
      <PricingFAQ />
    </div>
  );
};

export default PricingPlans;
