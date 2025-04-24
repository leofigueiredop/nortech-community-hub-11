
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info, Star, DollarSign, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlanFeature {
  name: string;
  tooltip: string;
  starter: boolean;
  professional: boolean;
  business: boolean;
  enterprise: boolean;
  whiteLabel: boolean;
}

interface PlanProps {
  name: string;
  monthlyPrice: number | string;
  yearlyPrice?: number | string;
  description: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  currentPlan?: boolean;
  onSelectPlan: () => void;
  onViewDetails: () => void;
}

const featuresComparison: PlanFeature[] = [
  { 
    name: "Cursos", 
    tooltip: "Ofereça cursos estruturados com módulos, lições e certificados", 
    starter: false, 
    professional: true, 
    business: true, 
    enterprise: true, 
    whiteLabel: true 
  },
  { 
    name: "Branding personalizado", 
    tooltip: "Adicione sua logo, cores e customize a aparência da plataforma", 
    starter: false, 
    professional: true, 
    business: true, 
    enterprise: true, 
    whiteLabel: true 
  },
  { 
    name: "Workflows e API", 
    tooltip: "Automatize processos e integre com sistemas externos", 
    starter: false, 
    professional: false, 
    business: true, 
    enterprise: true, 
    whiteLabel: true 
  },
  { 
    name: "IA Agents / Terminal", 
    tooltip: "Assistentes de IA personalizados para sua comunidade", 
    starter: false, 
    professional: false, 
    business: false, 
    enterprise: true, 
    whiteLabel: true 
  },
  { 
    name: "Suporte prioritário", 
    tooltip: "Acesso a canais VIP de suporte com SLA garantido", 
    starter: false, 
    professional: false, 
    business: false, 
    enterprise: true, 
    whiteLabel: true 
  },
  { 
    name: "Sandbox / Testes", 
    tooltip: "Ambiente de teste separado para experimentar novas funcionalidades", 
    starter: false, 
    professional: false, 
    business: false, 
    enterprise: true, 
    whiteLabel: true 
  },
  { 
    name: "Membros máximos", 
    tooltip: "Número máximo de membros permitidos em sua comunidade", 
    starter: false, 
    professional: true, 
    business: true, 
    enterprise: true, 
    whiteLabel: true 
  },
];

const PlanCard: React.FC<PlanProps> = ({
  name,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  cta,
  recommended = false,
  currentPlan = false,
  onSelectPlan,
  onViewDetails
}) => {
  return (
    <div className={cn(
      "relative flex flex-col border rounded-xl overflow-hidden transition-all hover:shadow-lg",
      recommended ? "bg-gradient-to-b from-purple-50 to-white border-purple-300 dark:from-purple-950 dark:to-gray-900 dark:border-purple-800" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
      currentPlan ? "ring-2 ring-purple-600 dark:ring-purple-500" : ""
    )}>
      {currentPlan && (
        <div className="absolute top-0 left-0 w-full bg-purple-600 text-white text-xs py-1 text-center font-semibold">
          Current Plan
        </div>
      )}
      
      {recommended && (
        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-medium py-1 px-3 rounded-bl-lg">
          Recommended
        </div>
      )}
      
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        
        <div className="mb-4">
          <div className="flex items-baseline">
            <span className="text-3xl font-extrabold">
              {typeof monthlyPrice === 'number' ? `$${monthlyPrice}` : monthlyPrice}
            </span>
            {typeof monthlyPrice === 'number' && (
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/month</span>
            )}
          </div>
          {yearlyPrice && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {typeof yearlyPrice === 'number' ? `$${yearlyPrice} billed annually` : yearlyPrice}
            </div>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check size={18} className="text-green-500 mt-0.5 mr-2 shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-6 pt-0">
        <Button 
          onClick={onSelectPlan}
          className={cn(
            "w-full mb-2",
            recommended ? "bg-purple-600 hover:bg-purple-700" : ""
          )}
        >
          {cta}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full text-sm"
          onClick={onViewDetails}
        >
          {name === "White-Label" ? "Request Proposal" : "Compare Plans"}
        </Button>
      </div>
    </div>
  );
};

const PricingPlans: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('USD');
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const { isMobile } = useIsMobile();
  
  const currencySymbol = currency === 'USD' ? '$' : 'R$';
  const discountPercentage = 10;

  const handleSelectPlan = (plan: string) => {
    console.log(`Selected plan: ${plan}`);
    // Implement subscription logic
  };

  const handleViewDetails = () => {
    setShowComparisonDialog(true);
  };

  const calculateYearlyPrice = (monthlyPrice: number): number => {
    const yearlyTotal = monthlyPrice * 12;
    const discountAmount = yearlyTotal * (discountPercentage / 100);
    return Math.round(yearlyTotal - discountAmount);
  };
  
  const plans = [
    {
      name: "Starter",
      monthlyPrice: "Free",
      description: "Perfect for small communities just getting started",
      features: [
        "Até 100 membros",
        "Espaço limitado",
        "Branding Nortech",
        "Ferramentas básicas de posts e eventos"
      ],
      cta: "Começar agora",
      currentPlan: true
    },
    {
      name: "Professional",
      monthlyPrice: 89,
      yearlyPrice: calculateYearlyPrice(89),
      description: "Get key community building features, all in one place",
      features: [
        "Até 1.000 membros",
        "Cursos, lives e salas",
        "Branding personalizado",
        "Analytics e snippets",
        "Conversão com afiliados"
      ],
      cta: "Assinar plano",
      recommended: true
    },
    {
      name: "Business",
      monthlyPrice: 199,
      yearlyPrice: calculateYearlyPrice(199),
      description: "Scale your community with workflows and customizations",
      features: [
        "Tudo do Professional +",
        "API para membros",
        "Campos de perfil customizáveis",
        "Workflows e notificações customizadas",
        "Scores, transcrição automática"
      ],
      cta: "Expandir comunidade"
    },
    {
      name: "Enterprise",
      monthlyPrice: 360,
      yearlyPrice: calculateYearlyPrice(360),
      description: "Full features, highest limits and priority support",
      features: [
        "Tudo do Business +",
        "Agentes de IA e IA Terminal",
        "Moderadores ilimitados",
        "Taxas reduzidas e SSO",
        "Suporte prioritário e sandbox",
        "Onboarding VIP"
      ],
      cta: "Plano completo"
    },
    {
      name: "White-Label",
      monthlyPrice: "Sob consulta",
      description: "Custom solution with your own branding and domain",
      features: [
        "App e domínio próprio",
        "Customizações completas",
        "Time de sucesso dedicado",
        "Integrações corporativas"
      ],
      cta: "Falar com o time"
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Escolha o plano ideal para sua comunidade</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Comece com o plano que se adapta ao seu momento e evolua com a gente.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.name}
            name={plan.name}
            monthlyPrice={
              typeof plan.monthlyPrice === 'number' && billingPeriod === 'annually' 
                ? Math.round(plan.monthlyPrice * 0.9) // 10% discount
                : plan.monthlyPrice
            }
            yearlyPrice={billingPeriod === 'annually' && typeof plan.yearlyPrice === 'number' 
              ? plan.yearlyPrice 
              : undefined
            }
            description={plan.description}
            features={plan.features}
            cta={plan.cta}
            recommended={plan.recommended}
            currentPlan={plan.currentPlan}
            onSelectPlan={() => handleSelectPlan(plan.name)}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Perguntas Frequentes</h3>
        
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
            <summary className="font-medium cursor-pointer">Qual plano é ideal para mim?</summary>
            <div className="mt-2 text-gray-600 dark:text-gray-300">
              <p>Para comunidades iniciantes, o plano <strong>Starter</strong> é uma boa opção para experimentar a plataforma. 
              Se você está sério sobre construir uma comunidade, o plano <strong>Professional</strong> oferece ferramentas essenciais. 
              Para funcionalidades avançadas e automatizações, considere o <strong>Business</strong> ou <strong>Enterprise</strong>.</p>
            </div>
          </details>
          
          <details className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
            <summary className="font-medium cursor-pointer">Posso mudar de plano depois?</summary>
            <div className="mt-2 text-gray-600 dark:text-gray-300">
              <p>Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Ao fazer upgrade, você terá acesso instantâneo às novas funcionalidades. Para downgrades, as mudanças serão aplicadas no próximo ciclo de faturamento.</p>
            </div>
          </details>
          
          <details className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
            <summary className="font-medium cursor-pointer">Como funciona o plano White-Label?</summary>
            <div className="mt-2 text-gray-600 dark:text-gray-300">
              <p>O plano White-Label oferece uma solução totalmente personalizada com seu próprio domínio e marca. Inclui todas as funcionalidades do Enterprise, mais personalizações exclusivas e um time dedicado ao seu sucesso. Entre em contato com nossa equipe para uma proposta sob medida.</p>
            </div>
          </details>
        </div>
      </div>
      
      <Dialog open={showComparisonDialog} onOpenChange={setShowComparisonDialog}>
        <DialogContent className="max-w-[90vw] w-[1000px]">
          <DialogHeader>
            <DialogTitle>Comparar Planos</DialogTitle>
            <DialogDescription>
              Veja detalhes completos sobre o que cada plano oferece
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
                  <TableHead>White-Label</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featuresComparison.map((feature) => (
                  <TableRow key={feature.name}>
                    <TableCell className="font-medium">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1">
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
                    <TableCell>
                      {feature.name === "Membros máximos" ? "100" : (
                        feature.starter ? <Check size={18} className="text-green-500" /> : <span className="text-red-500">✕</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {feature.name === "Membros máximos" ? "1,000" : (
                        feature.professional ? <Check size={18} className="text-green-500" /> : <span className="text-red-500">✕</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {feature.name === "Membros máximos" ? "10,000" : (
                        feature.business ? <Check size={18} className="text-green-500" /> : <span className="text-red-500">✕</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {feature.name === "Membros máximos" ? "Ilimitado" : (
                        feature.enterprise ? <Check size={18} className="text-green-500" /> : <span className="text-red-500">✕</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {feature.name === "Membros máximos" ? "Ilimitado" : (
                        feature.whiteLabel ? <Check size={18} className="text-green-500" /> : <span className="text-red-500">✕</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingPlans;
