
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, PlusCircle, Lock, ExternalLink, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
              Paywalls allow you to charge for access to your entire community, a course, or private spaces without needing any additional payment tools. You can create spaces to gate exclusive content, and make paywalls to unlock access to those spaces.
            </p>
            <p>
              Once you set up a paywall, you can share the checkout link with your audience to make a purchase and unlock access to areas in your community. You can create as many paywalls as you'd like.
            </p>
            <p className="flex items-center gap-2">
              Nortech uses <span className="font-semibold">Stripe</span> to securely process payments. To accept payments in your community, please connect your Stripe account.
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Your Paywalls</CardTitle>
            <CardDescription>
              Manage existing paywalls or create new ones
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-center py-8 border border-dashed rounded-md border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No paywalls created yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleCreatePaywall}
              >
                <PlusCircle size={16} />
                Create Paywall
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Gated Spaces</CardTitle>
            <CardDescription>
              Manage spaces that require payment to access
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
      </div>
      
      <Card className="mt-4 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Pricing Models</CardTitle>
          <CardDescription>
            Set up different pricing options for your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              className="border rounded-md p-4 hover:border-nortech-purple cursor-pointer transition-colors flex justify-between items-center"
              onClick={() => {
                toast({
                  title: "One-time Payment",
                  description: "One-time payment configuration would open here."
                });
              }}
            >
              <div>
                <h3 className="font-semibold mb-2">One-time Payment</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Charge a single fee for permanent access</p>
              </div>
              <ChevronRight className="text-gray-400" size={18} />
            </div>
            
            <div 
              className="border rounded-md p-4 hover:border-nortech-purple cursor-pointer transition-colors flex justify-between items-center"
              onClick={() => {
                toast({
                  title: "Subscription",
                  description: "Subscription configuration would open here."
                });
              }}
            >
              <div>
                <h3 className="font-semibold mb-2">Subscription</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recurring monthly or annual payments</p>
              </div>
              <ChevronRight className="text-gray-400" size={18} />
            </div>
            
            <div 
              className="border rounded-md p-4 hover:border-nortech-purple cursor-pointer transition-colors flex justify-between items-center"
              onClick={() => {
                toast({
                  title: "Tiered Access",
                  description: "Tiered access configuration would open here."
                });
              }}
            >
              <div>
                <h3 className="font-semibold mb-2">Tiered Access</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Multiple membership levels with different benefits</p>
              </div>
              <ChevronRight className="text-gray-400" size={18} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaywallSettings;
