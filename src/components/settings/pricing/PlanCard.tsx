
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PlanFeature {
  text: string;
}

interface PlanProps {
  name: string;
  monthlyPrice: string | number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  cta: string;
  currentPlan?: boolean;
  recommended?: boolean;
  billingPeriod: 'monthly' | 'annually';
  currency: 'USD' | 'BRL';
}

const PlanCard: React.FC<PlanProps> = ({
  name,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  cta,
  currentPlan,
  recommended,
  billingPeriod,
  currency
}) => {
  return (
    <div 
      className={cn(
        "rounded-xl p-6 border-2 transition-all",
        recommended ? 
          "bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-gray-900 border-purple-300 dark:border-purple-800" : 
          "bg-card border-gray-200 dark:border-gray-800",
        currentPlan ? "ring-2 ring-purple-600 dark:ring-purple-500" : ""
      )}
    >
      {currentPlan && (
        <div className="text-center bg-purple-600 text-white text-xs py-1 rounded-t-lg mb-4 -mx-6 -mt-6">
          Plano Atual
        </div>
      )}
      
      {recommended && (
        <Badge className="bg-purple-600 mb-4">Mais Popular</Badge>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">
            {typeof monthlyPrice === 'number' ? 
              `${currency === 'USD' ? '$' : 'R$'}${monthlyPrice}` : 
              monthlyPrice}
          </span>
          {typeof monthlyPrice === 'number' && (
            <span className="text-sm text-gray-500 ml-1">/mês</span>
          )}
        </div>
        {yearlyPrice && billingPeriod === 'annually' && (
          <div className="text-sm text-gray-500">
            {currency === 'USD' ? '$' : 'R$'}{yearlyPrice} cobrado anualmente
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start text-sm">
            <Check size={18} className="text-green-500 mt-0.5 mr-2 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button className="w-full mb-2" variant={recommended ? "default" : "outline"}>
        {cta}
      </Button>
    </div>
  );
};

export default PlanCard;
