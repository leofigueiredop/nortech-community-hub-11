
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const MembershipPlansForm: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('annually');
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (!selectedPlan) return;
    // Here you would typically save the selected plan to your state/context
    console.log(`Selected plan: ${selectedPlan}, billing: ${billingPeriod}`);
    navigate('/onboarding/final-step');
  };
  
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'Free',
      description: 'Para comunidades pequenas que estão começando',
      features: [
        'Até 100 membros',
        'Ferramentas básicas',
        'Espaço limitado',
        'Branding Nortech'
      ]
    },
    {
      id: 'growth',
      name: 'Professional',
      price: 49,
      yearlyPrice: 470,
      description: 'As principais ferramentas para construir sua comunidade',
      features: [
        'Até 1.000 membros',
        'Cursos, lives e salas',
        'Analytics e snippets',
        'Branding personalizado',
        'Conversão com afiliados'
      ],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Business',
      price: 199,
      yearlyPrice: 1990,
      description: 'Escale sua comunidade com automações e customizações',
      features: [
        'API para membros',
        'Campos customizáveis',
        'Workflows e notificações',
        'Transcrição automática',
        'Scores e automações'
      ]
    }
  ];

  return (
    <div className="container mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Escolha seu Plano</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Selecione o plano que melhor se adapta às necessidades da sua comunidade. Você pode atualizar depois.
          </p>
          
          <div className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 p-1">
            <Button
              size="sm"
              variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
              className={cn(
                "rounded-full",
                billingPeriod === 'monthly' ? "bg-white dark:bg-gray-700" : ""
              )}
              onClick={() => setBillingPeriod('monthly')}
            >
              Mensal
            </Button>
            <Button
              size="sm"
              variant={billingPeriod === 'annually' ? 'default' : 'ghost'}
              className={cn(
                "rounded-full gap-2",
                billingPeriod === 'annually' ? "bg-white dark:bg-gray-700" : ""
              )}
              onClick={() => setBillingPeriod('annually')}
            >
              Anual
              <Badge variant="default" className="bg-green-600 text-white">Economize 20%</Badge>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const price = typeof plan.price === 'number' && billingPeriod === 'annually' && plan.yearlyPrice 
              ? Math.round(plan.yearlyPrice / 12) 
              : plan.price;
              
            return (
              <Card 
                key={plan.id} 
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md border-2",
                  isSelected ? "border-purple-600 dark:border-purple-400" : "border-transparent",
                  plan.recommended ? "bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-gray-900" : ""
                )}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.recommended && (
                  <div className="bg-purple-600 text-white text-xs font-medium py-1 text-center">
                    Recomendado
                  </div>
                )}
                
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="flex items-baseline mt-1">
                      <span className="text-3xl font-extrabold">
                        {typeof price === 'number' ? `$${price}` : price}
                      </span>
                      {typeof price === 'number' && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/mês</span>
                      )}
                    </div>
                    {billingPeriod === 'annually' && plan.yearlyPrice && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ${plan.yearlyPrice} cobrado anualmente
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {plan.description}
                  </p>
                  
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check size={16} className="text-green-500 mt-1 mr-2 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/onboarding/invite')}>
            Voltar
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!selectedPlan}
          >
            Continuar
          </Button>
        </div>
        
        <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-sm">
          <div className="flex items-start gap-2">
            <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Precisa de ajuda para escolher?</p>
              <p className="text-gray-600 dark:text-gray-300">
                Fale com nosso time para recomendações personalizadas ou soluções customizadas para as necessidades específicas da sua comunidade.
              </p>
              <Button variant="link" className="p-0 h-auto text-purple-600 dark:text-purple-400">
                Falar com o time comercial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlansForm;
