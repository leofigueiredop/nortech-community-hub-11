
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, PlusCircle, Lock, ExternalLink } from 'lucide-react';

const PaywallSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Paywalls & Monetization</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Create paywalls to gate premium content and monetize your community.
        </p>
      </div>
      
      <Card className="bg-gray-900 text-white border-gray-700 mb-8">
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
        <CardFooter className="border-t border-gray-800 pt-4 gap-3">
          <Button className="flex items-center gap-2">
            <DollarSign size={16} />
            Connect with Stripe
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink size={16} />
            Learn more
          </Button>
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
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
              >
                <PlusCircle size={16} />
                Create Paywall
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
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
              >
                <Lock size={16} />
                Create Gated Space
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Pricing Models</CardTitle>
          <CardDescription>
            Set up different pricing options for your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 hover:border-nortech-purple cursor-pointer transition-colors">
              <h3 className="font-semibold mb-2">One-time Payment</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Charge a single fee for permanent access</p>
            </div>
            
            <div className="border rounded-md p-4 hover:border-nortech-purple cursor-pointer transition-colors">
              <h3 className="font-semibold mb-2">Subscription</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recurring monthly or annual payments</p>
            </div>
            
            <div className="border rounded-md p-4 hover:border-nortech-purple cursor-pointer transition-colors">
              <h3 className="font-semibold mb-2">Tiered Access</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Multiple membership levels with different benefits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaywallSettings;
