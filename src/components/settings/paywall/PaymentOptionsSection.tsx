
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">Need a custom solution?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Contact our team to discuss enterprise solutions, custom features, or special requirements.
        </p>
        <Button variant="default" className="bg-nortech-purple hover:bg-nortech-purple/90">Contact Sales</Button>
      </div>
    </div>
  );
};

export default PaymentOptionsSection;
