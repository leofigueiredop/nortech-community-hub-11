
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DollarSign, CreditCard } from 'lucide-react';

interface BillingTogglesProps {
  currency: 'USD' | 'BRL';
  billingPeriod: 'monthly' | 'annually';
  setCurrency: (currency: 'USD' | 'BRL') => void;
  setBillingPeriod: (period: 'monthly' | 'annually') => void;
}

const BillingToggles: React.FC<BillingTogglesProps> = ({
  currency,
  billingPeriod,
  setCurrency,
  setBillingPeriod
}) => {
  return (
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
  );
};

export default BillingToggles;
