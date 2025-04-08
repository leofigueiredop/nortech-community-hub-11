
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, PlusCircle, Lock, ExternalLink, ChevronRight, CreditCard, Globe, Smartphone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PaywallSettings: React.FC = () => {
  const { toast } = useToast();
  const [connectingStripe, setConnectingStripe] = useState(false);
  
  const handleConnectStripe = () => {
    setConnectingStripe(true);
    // Simulate API call
    setTimeout(() => {
      setConnectingStripe(false);
      toast({
        title: "Stripe Connected",
        description: "Your Stripe account has been successfully connected.",
      });
    }, 1500);
  };
  
  const handleCreatePaywall = () => {
    toast({
      title: "Create Paywall",
      description: "The paywall creation flow would begin here.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Paywalls & Monetization</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Create paywalls to gate premium content and monetize your community.
        </p>
      </div>
      
      <Card className="bg-gradient-to-br from-indigo-900 to-purple-800 text-white border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Start accepting payments with paywalls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Paywalls allow you to charge for access to your entire community, courses, or private spaces. With Nortech, you can accept both fiat and crypto payments.
            </p>
            <p>
              Once you set up a paywall, you can share the checkout link with your audience to make a purchase and unlock access to areas in your community. You can create as many paywalls as you'd like.
            </p>
            <p className="flex items-center gap-2">
              Nortech uses <span className="font-semibold">Stripe</span> for fiat payments. To accept payments in your community, please connect your Stripe account.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t border-white/10 pt-4 gap-3">
          <Button 
            className="flex items-center gap-2 bg-white text-purple-900 hover:bg-white/90"
            onClick={handleConnectStripe}
            disabled={connectingStripe}
          >
            <DollarSign size={16} />
            {connectingStripe ? 'Connecting...' : 'Connect with Stripe'}
          </Button>
          <Button variant="outline" className="flex items-center gap-2 text-white border-white/30 hover:bg-white/10">
            <ExternalLink size={16} />
            Learn more
          </Button>
        </CardFooter>
      </Card>
      
      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="plans" className="text-sm">Membership Plans</TabsTrigger>
          <TabsTrigger value="spaces" className="text-sm">Gated Spaces</TabsTrigger>
          <TabsTrigger value="courses" className="text-sm">Course Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PlanCard 
              title="Basic Plan"
              icon={<Globe size={20} />}
              features={[
                "Logo, subdomain or own domain",
                "Up to 5 courses, 50 lessons each", 
                "Basic gamification (standard points)",
                "Community tools (chat, forum, groups)",
                "Email support, business hours"
              ]}
              tiers={[
                { members: "Up to 100 members", price: "R$150 / $30" },
                { members: "Up to 1,000 members", price: "R$350 / $70" },
                { members: "Up to 10,000 members", price: "R$800 / $160" },
                { members: "Unlimited", price: "R$1,200 / $240" }
              ]}
            />
            
            <PlanCard 
              title="Advanced Plan"
              icon={<CreditCard size={20} />}
              featured={true}
              features={[
                "Full branding removal, customization",
                "Unlimited courses",
                "Advanced gamification & Proof of Study",
                "Token/NFT support (optional)",
                "Private groups & nested communities",
                "Analytics dashboard",
                "API access & automation",
                "Up to 5 admins / 10 mods"
              ]}
              tiers={[
                { members: "Up to 100 members", price: "R$300 / $60" },
                { members: "Up to 1,000 members", price: "R$700 / $140" },
                { members: "Up to 10,000 members", price: "R$1,500 / $300" },
                { members: "Unlimited", price: "R$2,400 / $480" }
              ]}
            />
            
            <PlanCard 
              title="White Label + App"
              icon={<Smartphone size={20} />}
              features={[
                "Custom mobile app (Android & iOS)",
                "Fully branded experience",
                "Dedicated instance (optional)",
                "Enterprise integrations (SSO, CRMs)",
                "Custom features on demand",
                "SLA-based premium support",
                "Dedicated success manager"
              ]}
              tiers={[
                { members: "Up to 1,000 members", price: "R$1,500 / $300" },
                { members: "Up to 10,000 members", price: "R$3,000 / $600" },
                { members: "Up to 100,000 members", price: "R$6,000 / $1,200" },
                { members: "Unlimited", price: "R$9,000 / $1,800" }
              ]}
              setupFee="R$15,000 (~$3,000 one-time)"
            />
          </div>
          
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                toast({
                  title: "Create Custom Plan",
                  description: "You would now be directed to create a custom plan."
                });
              }}
              className="flex items-center gap-2 mx-auto"
            >
              <PlusCircle size={16} />
              Create Custom Plan
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="spaces">
          <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Gated Spaces</CardTitle>
              <CardDescription>
                Create private spaces that require payment to access
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-center py-8 border border-dashed rounded-md border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No gated spaces created yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => {
                    toast({
                      title: "Create Gated Space",
                      description: "The gated space creation flow would begin here."
                    });
                  }}
                >
                  <Lock size={16} />
                  Create Gated Space
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses">
          <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Course Access</CardTitle>
              <CardDescription>
                Set up pricing for your educational content
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-center py-8 border border-dashed rounded-md border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No course paywalls set up yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => {
                    toast({
                      title: "Create Course Paywall",
                      description: "The course paywall creation flow would begin here."
                    });
                  }}
                >
                  <PlusCircle size={16} />
                  Add Course Paywall
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-6 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Configure how users can pay for access to your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              className="border rounded-md p-4 hover:border-nortech-purple cursor-pointer transition-colors flex justify-between items-center"
              onClick={() => {
                toast({
                  title: "Fiat Payments",
                  description: "Configure traditional payment methods."
                });
              }}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="text-nortech-purple" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Fiat Payments</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Credit/debit cards, bank transfers</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={18} />
            </div>
            
            <div 
              className="border rounded-md p-4 hover:border-nortech-purple cursor-pointer transition-colors flex justify-between items-center"
              onClick={() => {
                toast({
                  title: "Crypto Payments",
                  description: "Configure cryptocurrency payment options."
                });
              }}
            >
              <div className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-nortech-purple">
                  <path d="M9 8H12M9 16H12M12 8V4M12 8V16M12 16V20M16 8H15M16 16H15M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <h3 className="font-semibold mb-1">Crypto Payments</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bitcoin, Ethereum, stablecoins</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={18} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface PlanCardProps {
  title: string;
  icon: React.ReactNode;
  features: string[];
  tiers: { members: string; price: string }[];
  setupFee?: string;
  featured?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, icon, features, tiers, setupFee, featured }) => {
  return (
    <Card className={`overflow-hidden ${featured ? 'border-nortech-purple ring-2 ring-nortech-purple ring-opacity-50' : ''}`}>
      {featured && (
        <div className="bg-nortech-purple text-white text-center py-1 text-xs font-semibold">
          RECOMMENDED
        </div>
      )}
      <CardHeader className={`${featured ? 'bg-nortech-purple/10' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>
          {features[0]}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Features</h4>
            <ul className="text-sm space-y-1">
              {features.slice(1).map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-green-500 mt-1 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Pricing Tiers</h4>
            <ul className="text-sm space-y-2 border-t pt-2">
              {tiers.map((tier, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{tier.members}</span>
                  <span className="font-medium">{tier.price}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {setupFee && (
            <div className="border-t pt-2 text-sm">
              <span className="font-medium">Setup fee:</span> {setupFee}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t p-4">
        <Button 
          variant={featured ? "default" : "outline"} 
          className={`w-full ${featured ? 'bg-nortech-purple hover:bg-nortech-purple/90' : ''}`}
          onClick={() => {
            const { toast } = useToast();
            toast({
              title: `${title} Selected`,
              description: `You've selected the ${title} plan.`
            });
          }}
        >
          Configure
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaywallSettings;
