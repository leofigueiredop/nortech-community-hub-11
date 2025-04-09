
import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  onSelectPlan?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  price, 
  description, 
  features, 
  highlighted = false,
  buttonText,
  onSelectPlan
}) => {
  return (
    <div className={`rounded-lg p-6 ${highlighted ? 'bg-nortech-purple text-white' : 'bg-card border'}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-extrabold">{price}</span>
        {price !== 'Free' && <span className="ml-1 text-sm">/month</span>}
      </div>
      <p className={`mt-2 text-sm ${highlighted ? 'text-white/80' : 'text-muted-foreground'}`}>{description}</p>
      
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        className={`mt-6 w-full rounded-md py-2 font-medium ${
          highlighted 
            ? 'bg-white text-nortech-purple hover:bg-white/90' 
            : 'bg-nortech-purple text-white hover:bg-nortech-purple/90'
        }`}
        onClick={onSelectPlan}
      >
        {buttonText}
      </button>
    </div>
  );
};

interface PricingSectionProps {
  onSelectPlan?: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that's right for your community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard 
            title="Free"
            price="Free"
            description="Perfect for small communities just getting started"
            features={[
              "Up to 100 members",
              "Basic discussion forums",
              "Simple events calendar",
              "Community announcements",
              "Email notifications"
            ]}
            buttonText="Start for Free"
            onSelectPlan={onSelectPlan}
          />
          
          <PricingCard 
            title="Growth"
            price="$49"
            description="For growing communities with more engagement needs"
            features={[
              "Up to 1,000 members",
              "Advanced discussion features",
              "Content library & courses",
              "Custom branding",
              "Analytics dashboard",
              "Advanced moderation tools"
            ]}
            highlighted
            buttonText="Get Started"
            onSelectPlan={onSelectPlan}
          />
          
          <PricingCard 
            title="Enterprise"
            price="$199"
            description="For large communities with advanced requirements"
            features={[
              "Unlimited members",
              "White-label solution",
              "SSO integration",
              "API access",
              "Dedicated support",
              "Custom feature development",
              "Multiple admin roles"
            ]}
            buttonText="Contact Sales"
            onSelectPlan={onSelectPlan}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
