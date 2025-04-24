
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import BillingToggles from './pricing/BillingToggles';
import PlanCard from './pricing/PlanCard';
import { ComparisonDialog } from './pricing/ComparisonDialog';
import PricingFAQ from './pricing/PricingFAQ';

const featuresComparison = [
  {
    name: 'Membros máximos',
    tooltip: 'Número máximo de membros permitidos',
    starter: '100',
    professional: '1.000',
    business: '10.000',
    enterprise: 'Ilimitado',
    whiteLabel: 'Ilimitado'
  },
  {
    name: 'Administradores',
    tooltip: 'Número de administradores permitidos',
    starter: '1',
    professional: '3',
    business: '10',
    enterprise: 'Ilimitado',
    whiteLabel: 'Ilimitado'
  },
  {
    name: 'Moderadores',
    tooltip: 'Número de moderadores permitidos',
    starter: '1',
    professional: '10',
    business: '100',
    enterprise: 'Ilimitado',
    whiteLabel: 'Ilimitado'
  },
  {
    name: 'Grupos de discussão',
    tooltip: 'Quantidade de grupos permitidos',
    starter: false,
    professional: true,
    business: true,
    enterprise: true,
    whiteLabel: true
  },
  {
    name: 'Branding personalizado',
    tooltip: 'Customize com suas cores e logo',
    starter: false,
    professional: true,
    business: true,
    enterprise: true,
    whiteLabel: true
  },
  {
    name: 'API / Campos customizados',
    tooltip: 'Integração via API e campos de perfil personalizados',
    starter: false,
    professional: false,
    business: true,
    enterprise: true,
    whiteLabel: true
  },
  {
    name: 'Agentes IA / Terminal',
    tooltip: 'Recursos avançados de IA para sua comunidade',
    starter: false,
    professional: false,
    business: false,
    enterprise: true,
    whiteLabel: true
  }
];

const PricingPlans: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('USD');
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);

  const plans = [
    {
      name: "Starter",
      monthlyPrice: "Free",
      description: "Para comunidades pequenas que estão começando",
      features: [
        "Até 100 membros",
        "1 administrador",
        "1 grupo de discussão",
        "Conteúdos ilimitados",
        "Suporte por email"
      ],
      cta: "Começar grátis",
      currentPlan: true
    },
    {
      name: "Professional",
      monthlyPrice: 89,
      yearlyPrice: 850,
      description: "As principais ferramentas para construir sua comunidade",
      features: [
        "Tudo do Starter, mais:",
        "Até 1.000 membros",
        "3 administradores",
        "10 grupos",
        "Branding personalizado"
      ],
      cta: "Assinar agora",
      recommended: true
    },
    {
      name: "Business",
      monthlyPrice: 199,
      yearlyPrice: 1990,
      description: "Escale sua comunidade com automações",
      features: [
        "Tudo do Professional, mais:",
        "10.000 membros",
        "10 administradores",
        "100 grupos",
        "API e campos customizáveis"
      ],
      cta: "Expandir"
    },
    {
      name: "Enterprise",
      monthlyPrice: "Sob consulta",
      description: "Solução completa para grandes comunidades",
      features: [
        "Tudo do Business, mais:",
        "Membros ilimitados",
        "Agentes IA e Terminal",
        "SSO e sandbox",
        "Suporte prioritário"
      ],
      cta: "Falar com vendas"
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Escolha o plano ideal para sua comunidade</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Comece com o que faz sentido hoje e evolua com a gente
        </p>
        
        <BillingToggles
          currency={currency}
          billingPeriod={billingPeriod}
          setCurrency={setCurrency}
          setBillingPeriod={setBillingPeriod}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.name}
            {...plan}
            billingPeriod={billingPeriod}
            currency={currency}
          />
        ))}
      </div>

      <div className="flex justify-center my-8">
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => setShowComparisonDialog(true)}
          className="gap-2"
        >
          <Info size={18} /> Comparar todos os planos
        </Button>
      </div>

      <ComparisonDialog
        open={showComparisonDialog}
        onOpenChange={setShowComparisonDialog}
        features={featuresComparison}
      />

      <PricingFAQ />
    </div>
  );
};

export default PricingPlans;
