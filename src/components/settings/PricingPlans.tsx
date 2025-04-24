
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info, X, CreditCard, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

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

const PricingPlans = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('USD');
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const { isMobile } = useIsMobile();

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
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <Button
              variant={currency === 'USD' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrency('USD')}
              className={cn(
                "rounded-full",
                currency === 'USD' ? "bg-white dark:bg-gray-700" : ""
              )}
            >
              <DollarSign size={16} className="mr-1" /> USD
            </Button>
            <Button
              variant={currency === 'BRL' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrency('BRL')}
              className={cn(
                "rounded-full",
                currency === 'BRL' ? "bg-white dark:bg-gray-700" : ""
              )}
            >
              <CreditCard size={16} className="mr-1" /> BRL
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <Button
              variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                "rounded-full",
                billingPeriod === 'monthly' ? "bg-white dark:bg-gray-700" : ""
              )}
            >
              Mensal
            </Button>
            <Button
              variant={billingPeriod === 'annually' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingPeriod('annually')}
              className={cn(
                "rounded-full gap-2",
                billingPeriod === 'annually' ? "bg-white dark:bg-gray-700" : ""
              )}
            >
              Anual
              <Badge className="bg-green-600 text-white">Economize 10%</Badge>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={cn(
              "rounded-xl p-6 border-2 transition-all",
              plan.recommended ? 
                "bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-gray-900 border-purple-300 dark:border-purple-800" : 
                "bg-card border-gray-200 dark:border-gray-800",
              plan.currentPlan ? "ring-2 ring-purple-600 dark:ring-purple-500" : ""
            )}
          >
            {plan.currentPlan && (
              <div className="text-center bg-purple-600 text-white text-xs py-1 rounded-t-lg mb-4 -mx-6 -mt-6">
                Plano Atual
              </div>
            )}
            
            {plan.recommended && (
              <Badge className="bg-purple-600 mb-4">Mais Popular</Badge>
            )}
            
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  {typeof plan.monthlyPrice === 'number' ? 
                    `${currency === 'USD' ? '$' : 'R$'}${plan.monthlyPrice}` : 
                    plan.monthlyPrice}
                </span>
                {typeof plan.monthlyPrice === 'number' && (
                  <span className="text-sm text-gray-500 ml-1">/mês</span>
                )}
              </div>
              {plan.yearlyPrice && billingPeriod === 'annually' && (
                <div className="text-sm text-gray-500">
                  {currency === 'USD' ? '$' : 'R$'}{plan.yearlyPrice} cobrado anualmente
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <Check size={18} className="text-green-500 mt-0.5 mr-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full mb-2" variant={plan.recommended ? "default" : "outline"}>
              {plan.cta}
            </Button>
          </div>
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

      <Dialog open={showComparisonDialog} onOpenChange={setShowComparisonDialog}>
        <DialogContent className="max-w-[90vw] w-[900px]">
          <DialogHeader>
            <DialogTitle>Comparação detalhada dos planos</DialogTitle>
            <DialogDescription>
              Veja todos os recursos disponíveis em cada plano
            </DialogDescription>
          </DialogHeader>
          
          <div className={isMobile ? "overflow-x-auto" : ""}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recursos</TableHead>
                  <TableHead>Starter</TableHead>
                  <TableHead>Professional</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Enterprise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featuresComparison.map((feature) => (
                  <TableRow key={feature.name}>
                    <TableCell className="font-medium whitespace-nowrap">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 cursor-help">
                              {feature.name}
                              <Info size={14} className="text-gray-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    {['starter', 'professional', 'business', 'enterprise'].map((planKey) => (
                      <TableCell key={planKey}>
                        {typeof feature[planKey] === 'string' ? (
                          <span>{feature[planKey]}</span>
                        ) : (
                          feature[planKey] ? (
                            <Check size={18} className="text-green-500" />
                          ) : (
                            <X size={18} className="text-gray-400" />
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

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
    </div>
  );
};

export default PricingPlans;
