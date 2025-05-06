import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/api/ApiClient';
import { CreditCard, DollarSign } from 'lucide-react';

interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
}

const Billing: React.FC = () => {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = React.useState<BillingPlan | null>(null);
  const [availablePlans, setAvailablePlans] = React.useState<BillingPlan[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const loadBillingInfo = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockPlans: BillingPlan[] = [
          {
            id: 'starter',
            name: 'Starter',
            price: 0,
            interval: 'monthly',
            features: [
              'Up to 100 members',
              'Basic community features',
              'Standard support'
            ],
            isActive: true
          },
          {
            id: 'pro',
            name: 'Professional',
            price: 29,
            interval: 'monthly',
            features: [
              'Up to 1,000 members',
              'Advanced community features',
              'Priority support',
              'Custom domain',
              'Analytics'
            ],
            isActive: false
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 99,
            interval: 'monthly',
            features: [
              'Unlimited members',
              'All features included',
              '24/7 support',
              'Custom integrations',
              'Dedicated account manager'
            ],
            isActive: false
          }
        ];

        setAvailablePlans(mockPlans);
        setCurrentPlan(mockPlans.find(plan => plan.isActive) || null);
      } catch (error) {
        console.error('Error loading billing info:', error);
        toast({
          title: 'Error',
          description: 'Failed to load billing information.',
          variant: 'destructive'
        });
      }
    };

    loadBillingInfo();
  }, [toast]);

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);
    try {
      // Mock upgrade - replace with actual API call
      toast({
        title: 'Coming Soon',
        description: 'Billing upgrades will be available soon.',
      });
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to upgrade plan. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout activeSection="billing" title="Billing Settings">
      {/* Current Plan */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Current Plan</h3>
              <p className="text-sm text-muted-foreground">
                {currentPlan?.name || 'No active plan'}
              </p>
            </div>
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
          {currentPlan && (
            <div className="space-y-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">${currentPlan.price}</span>
                <span className="text-muted-foreground ml-2">/{currentPlan.interval}</span>
              </div>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {availablePlans.map((plan) => (
          <Card key={plan.id} className={plan.isActive ? 'border-primary' : ''}>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.interval}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.isActive || isLoading}
                className="w-full"
                variant={plan.isActive ? 'outline' : 'default'}
              >
                {plan.isActive ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </SettingsLayout>
  );
};

export default Billing; 