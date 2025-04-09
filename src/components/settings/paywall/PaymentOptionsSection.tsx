
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentIcon from './PaymentIcon';

const PaymentOptionsSection: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-8 md:mt-16 space-y-6 md:space-y-8">
      <h2 className="text-xl md:text-2xl font-bold text-center">Payment Options</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fiat Payments</CardTitle>
            <CardDescription>Accept traditional payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <PaymentIcon 
                name="VISA" 
                bgColorClass="bg-blue-100 dark:bg-blue-900" 
                textColorClass="text-blue-600 dark:text-blue-300" 
                type="square"
              />
              <PaymentIcon 
                name="MC" 
                bgColorClass="bg-red-100 dark:bg-red-900" 
                textColorClass="text-red-600 dark:text-red-300" 
                type="square"
              />
              <PaymentIcon 
                name="PIX" 
                bgColorClass="bg-gray-100 dark:bg-gray-700" 
                textColorClass="text-gray-600 dark:text-gray-300" 
                type="square"
              />
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
              <PaymentIcon 
                name="BTC" 
                bgColorClass="bg-amber-100 dark:bg-amber-900" 
                textColorClass="text-amber-600 dark:text-amber-300" 
                type="circle"
              />
              <PaymentIcon 
                name="ETH" 
                bgColorClass="bg-blue-100 dark:bg-blue-900" 
                textColorClass="text-blue-600 dark:text-blue-300" 
                type="circle"
              />
              <PaymentIcon 
                name="USDC" 
                bgColorClass="bg-green-100 dark:bg-green-900" 
                textColorClass="text-green-600 dark:text-green-300" 
                type="circle"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Accept Bitcoin, Ethereum, USDC and other major cryptocurrencies with our integrated payment gateway.
            </p>
            <Button variant="outline" className="w-full">Configure Crypto Gateway</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">Need a custom solution?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Contact our team to discuss enterprise solutions, custom features, or special requirements.
        </p>
        <Button variant="default" className="bg-purple-600 hover:bg-purple-700">Contact Sales</Button>
      </div>
    </div>
  );
};

export default PaymentOptionsSection;
