
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PricingSection = () => {
  const plans = [
    {
      name: "Professional",
      price: 89,
      description: "Get key community building features, all in one place",
      highlight: false,
      cta: "Free 14-day trial",
      secondaryCta: null,
      features: [
        "Rich member profiles",
        "Searchable member directory",
        "Discussions",
        "Events",
        "Paid memberships",
        "Weekly community digest",
        "Gamification",
        "Custom domain"
      ],
      additionalFeatures: [
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
      price: 199,
      description: "Scale your community with workflows and customizations",
      highlight: false,
      cta: "Free 14-day trial",
      secondaryCta: "Talk to sales",
      features: [
        "Workflows",
        "Custom profile fields",
        "Headless Member API",
        "Admin API",
        "Branded email notifications",
        "Content co-pilot",
        "Automated transcriptions",
        "Activity scores"
      ],
      additionalFeatures: [
        "Migration services for courses"
      ]
    },
    {
      name: "Enterprise",
      price: 360,
      originalPrice: 499,
      description: "Run your business with full feature access and the highest limits",
      highlight: true,
      discount: "28% OFF",
      cta: "Free 14-day trial",
      secondaryCta: "Talk to sales",
      features: [
        "AI Agents",
        "Unlimited workflows",
        "Custom single sign-on (SSO)",
        "Priority support",
        "Advanced analytics",
        "Lower transaction fees",
        "Sandbox community",
        "Up to 10 admins & 100 moderators"
      ],
      additionalFeatures: [
        "Concierge onboarding",
        "Quarterly business reviews",
        "Dedicated customer success manager"
      ]
    },
    {
      name: "Plus Branded App",
      price: "Custom Pricing",
      description: "Launch your own branded mobile apps, with everything done-for-you",
      highlight: false,
      cta: "Talk to sales",
      secondaryCta: "Explore Plus Branded App",
      features: [
        "Your own iOS and Android apps",
        "Prioritized migration services",
        "Dedicated launch team",
        "Access to Circle's design studio",
        "Branded push notifications",
        "Offer in-app purchases",
        "Higher limits across the board"
      ],
      additionalFeatures: []
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-nortech-dark-blue dark:text-white">Choose the right plan for your community</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            All plans include the core features you need to build a thriving community platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card key={index} className={`border ${plan.highlight ? 'border-t-4 border-t-indigo-600' : ''} ${index === 2 ? 'bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950 dark:to-slate-900' : ''} relative`}>
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                  {plan.discount}
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  {typeof plan.price === 'number' ? (
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-nortech-purple">${plan.price}</span>
                      <span className="text-sm text-gray-500 ml-1">/mo*</span>
                      {plan.originalPrice && (
                        <span className="text-sm text-gray-500 ml-2 line-through">${plan.originalPrice}</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-nortech-purple">{plan.price}</div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-nortech-purple hover:bg-nortech-purple/90">{plan.cta}</Button>
                  {plan.secondaryCta && (
                    <Button variant="outline" className="w-full">{plan.secondaryCta}</Button>
                  )}
                  
                  <div>
                    <p className="font-medium text-sm mb-3 mt-6">Core features:</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.additionalFeatures.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-3 mt-6">
                        {index === 2 || index === 1 ? "Annual plan only:" : "And:"}
                      </p>
                      <ul className="space-y-2">
                        {plan.additionalFeatures.map((feature, i) => (
                          <li key={i} className="flex text-sm">
                            <Star className="h-4 w-4 text-purple-500 mr-2 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-6 text-sm text-gray-500">
          * Save 20% with annual billing
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
