
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PaywallSettings: React.FC = () => {
  const planFeatures = {
    basic: [
      "Community tools (chat, forum, groups)",
      "Up to 5 courses, 50 lessons each",
      "1 admin",
      "Basic gamification (standard points)",
      "Email support, business hours"
    ],
    advanced: [
      "All Basic features",
      "Full branding removal, layout customization",
      "Unlimited courses",
      "Advanced gamification & Proof of Study",
      "Token/NFT support (optional)",
      "Private groups & nested communities",
      "Analytics dashboard",
      "API access & automation",
      "Up to 5 admins / 10 mods",
      "Priority onboarding and chat support"
    ],
    whitelabel: [
      "All Advanced features",
      "Custom mobile app (Android & iOS)",
      "Fully branded experience (no Nortech ref.)",
      "Dedicated instance (optional)",
      "Enterprise integrations (SSO, CRMs, LMSs)",
      "Custom features on demand",
      "SLA-based premium support",
      "Dedicated success manager"
    ]
  };

  const pricing = {
    basic: [
      { members: 100, price: "R$150 / ~$30" },
      { members: 1000, price: "R$350 / ~$70" },
      { members: 10000, price: "R$800 / ~$160" },
      { members: "Unlimited", price: "R$1,200 / ~$240" }
    ],
    advanced: [
      { members: 100, price: "R$300 / ~$60" },
      { members: 1000, price: "R$700 / ~$140" },
      { members: 10000, price: "R$1,500 / ~$300" },
      { members: "Unlimited", price: "R$2,400 / ~$480" }
    ],
    whitelabel: [
      { members: 1000, price: "R$1,500 / ~$300" },
      { members: 10000, price: "R$3,000 / ~$600" },
      { members: 100000, price: "R$6,000 / ~$1,200" },
      { members: "Unlimited", price: "R$9,000 / ~$1,800" }
    ]
  };

  return (
    <div className="container mx-auto p-6 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <h1 className="text-3xl font-bold">Nortech Communities Pricing Plans</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the right plan for your community. All plans include the ability to create a branded digital space combining community and education tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <Card className="border-t-4 border-t-blue-500 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Basic Plan</CardTitle>
            <CardDescription>Community Essentials</CardDescription>
            <div className="mt-4">
              <div className="text-3xl font-bold text-nortech-purple">From R$150 <span className="text-sm font-normal text-gray-500">/month</span></div>
              <div className="text-sm text-gray-500 mt-1">~$30 USD</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
              <p className="font-medium">Features include:</p>
              <ul className="space-y-2">
                {planFeatures.basic.map((feature, index) => (
                  <li key={index} className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-4">
                <p className="font-medium mb-2">Pricing tiers:</p>
                <ul className="space-y-1">
                  {pricing.basic.map((tier, index) => (
                    <li key={index} className="text-sm flex justify-between">
                      <span>Up to {tier.members} members:</span>
                      <span className="font-medium">{tier.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Choose Basic Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Plan */}
        <Card className="border-t-4 border-t-purple-600 shadow-lg relative">
          <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
            POPULAR
          </div>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Advanced Plan</CardTitle>
            <CardDescription>Custom Engagement</CardDescription>
            <div className="mt-4">
              <div className="text-3xl font-bold text-nortech-purple">From R$300 <span className="text-sm font-normal text-gray-500">/month</span></div>
              <div className="text-sm text-gray-500 mt-1">~$60 USD</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
              <p className="font-medium">Everything in Basic, plus:</p>
              <ul className="space-y-2">
                {planFeatures.advanced.map((feature, index) => (
                  <li key={index} className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-4">
                <p className="font-medium mb-2">Pricing tiers:</p>
                <ul className="space-y-1">
                  {pricing.advanced.map((tier, index) => (
                    <li key={index} className="text-sm flex justify-between">
                      <span>Up to {tier.members} members:</span>
                      <span className="font-medium">{tier.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Choose Advanced Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* White Label Plan */}
        <Card className="border-t-4 border-t-emerald-600 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">White Label + App</CardTitle>
            <CardDescription>Full Custom Solution</CardDescription>
            <div className="mt-4">
              <div className="text-3xl font-bold text-nortech-purple">From R$1,500 <span className="text-sm font-normal text-gray-500">/month</span></div>
              <div className="text-sm text-gray-500 mt-1">~$300 USD + Setup Fee</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
              <p className="font-medium">Everything in Advanced, plus:</p>
              <ul className="space-y-2">
                {planFeatures.whitelabel.map((feature, index) => (
                  <li key={index} className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-4">
                <p className="font-medium mb-2">Pricing tiers:</p>
                <div className="text-sm mb-2">Setup Fee: R$15,000 (~US$3,000 one-time)</div>
                <ul className="space-y-1">
                  {pricing.whitelabel.map((tier, index) => (
                    <li key={index} className="text-sm flex justify-between">
                      <span>Up to {tier.members} members:</span>
                      <span className="font-medium">{tier.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Choose White Label</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-center">Payment Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fiat Payments</CardTitle>
              <CardDescription>Accept traditional payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                  VISA
                </div>
                <div className="w-12 h-8 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center text-red-600 dark:text-red-300 font-bold">
                  MC
                </div>
                <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                  PIX
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Accept credit cards, debit cards, and local payment methods like PIX (Brazil).
              </p>
              <Button variant="outline" className="w-full">Configure Fiat Gateway</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Crypto Payments</CardTitle>
              <CardDescription>Accept cryptocurrency payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-300 font-bold text-xs">
                  BTC
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs">
                  ETH
                </div>
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 font-bold text-xs">
                  USDC
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Accept Bitcoin, Ethereum, USDC and other major cryptocurrencies with our integrated payment gateway.
              </p>
              <Button variant="outline" className="w-full">Configure Crypto Gateway</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium mb-2">Need a custom solution?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Contact our team to discuss enterprise solutions, custom features, or special requirements.
          </p>
          <Button variant="default" className="bg-nortech-purple hover:bg-nortech-purple/90">Contact Sales</Button>
        </div>
      </div>
    </div>
  );
};

export default PaywallSettings;
