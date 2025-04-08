
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number;
  description: string;
  recommended?: boolean;
  features: string[];
}

const PricingPlans: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [currency, setCurrency] = useState<'USD'>('USD');
  
  const plans: Plan[] = [
    {
      name: "Professional",
      monthlyPrice: 89,
      yearlyPrice: 1068,
      yearlyDiscount: 120,
      description: "Get key community building features, all in one place",
      recommended: true,
      features: [
        "Courses",
        "Live streams",
        "Live rooms",
        "Unlimited members",
        "Custom branding",
        "Reporting & analytics",
        "Custom code snippets",
        "Conversion tracking"
      ]
    },
    {
      name: "Business",
      monthlyPrice: 199,
      yearlyPrice: 2388,
      yearlyDiscount: 240,
      description: "Scale your community with workflows and customizations",
      features: [
        "Workflows",
        "Custom profile fields",
        "Headless member API",
        "Admin API",
        "Branded email notifications",
        "Content co-pilot",
        "Automated transcriptions",
        "Activity scores"
      ]
    },
    {
      name: "Enterprise",
      monthlyPrice: 360,
      yearlyPrice: 4320,
      yearlyDiscount: 468,
      description: "Full features, highest limits and priority support",
      features: [
        "AI Agents",
        "Unlimited workflows",
        "Custom single sign-on (SSO)",
        "Priority support",
        "Advanced analytics",
        "Lower transaction fees",
        "Sandbox community",
        "Up to 10 admins & 100 moderators",
        "Concierge onboarding (annual plan only)",
        "Dedicated Customer Success Manager (annual plan only)"
      ]
    }
  ];

  return (
    <div className="bg-gray-900 p-8 rounded-lg text-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Pick your plan</h2>
        
        <div className="flex gap-4 items-center">
          <div className="border border-gray-700 rounded-md flex items-center">
            <Button variant="ghost" size="sm" className="text-white">
              $ USD
            </Button>
          </div>
          
          <div className="flex bg-gray-800 rounded-md overflow-hidden">
            <Button 
              variant={billingPeriod === 'monthly' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setBillingPeriod('monthly')}
              className={billingPeriod === 'monthly' ? 'bg-gray-700' : 'text-white'}
            >
              Monthly
            </Button>
            <Button 
              variant={billingPeriod === 'annually' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setBillingPeriod('annually')}
              className={billingPeriod === 'annually' ? 'bg-gray-700' : 'text-white'}
            >
              Annually
            </Button>
          </div>
          
          <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-md text-sm">
            Save 10%
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`rounded-lg overflow-hidden bg-gray-800 ${plan.recommended ? 'relative' : ''}`}
          >
            {plan.recommended && (
              <div className="bg-indigo-600 text-center py-2 text-sm font-semibold">
                Recommended
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold">
                  ${billingPeriod === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)}
                </span>
              </div>
              <div className="text-gray-400 text-sm mb-4">
                {billingPeriod === 'annually' && (
                  <>
                    ${plan.yearlyPrice} billed annually, save ${plan.yearlyDiscount}
                  </>
                )}
              </div>
              
              <p className="text-gray-300 mb-6">{plan.description}</p>
              
              <Button className="w-full mb-6">Upgrade</Button>
              
              <div className="text-sm text-gray-300 mb-4">
                {plan.name === "Professional" ? (
                  "Everything in Basic plus:"
                ) : plan.name === "Business" ? (
                  "Everything in Professional plus:"
                ) : (
                  "Everything in Business plus:"
                )}
              </div>
              
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {plan.name === "Professional" ? (
                      <Star size={16} className="text-white mt-0.5 shrink-0" />
                    ) : (
                      <Check size={16} className="text-white mt-0.5 shrink-0" />
                    )}
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="text-white border-gray-700">
          Compare plan features
        </Button>
      </div>
    </div>
  );
};

export default PricingPlans;
