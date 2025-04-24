import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentIcon from './PaymentIcon';
import { Badge } from '@/components/ui/badge';
import { Check, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FiatGatewayDialog from './modals/FiatGatewayDialog';
import CryptoGatewayDialog from './modals/CryptoGatewayDialog';

const PaymentOptionsSection: React.FC = () => {
  const [fiatDialogOpen, setFiatDialogOpen] = useState(false);
  const [cryptoDialogOpen, setCryptoDialogOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Payment Gateways</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Fiat Payments</CardTitle>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                <Check className="h-3 w-3 mr-1" /> Active
              </Badge>
            </div>
            <CardDescription>Accept traditional payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center flex-wrap gap-3">
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
              <PaymentIcon 
                name="AMEX" 
                bgColorClass="bg-indigo-100 dark:bg-indigo-900" 
                textColorClass="text-indigo-600 dark:text-indigo-300" 
                type="square"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full flex items-center gap-1 cursor-help">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Stripe
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Fee: 2.9% + $0.30</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full flex items-center gap-1 cursor-help">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      PayPal
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Fee: 3.49% + $0.49</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full flex items-center gap-1 cursor-help">
                      Hotmart
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Fee: 9.9% + R$1</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full flex items-center gap-1 cursor-help">
                      Asaas
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Fee: 4.99% (credit card)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full flex items-center gap-1 cursor-help">
                      Kiwify
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Fee: 4.99% + R$0.50</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full flex items-center gap-1 cursor-help">
                      Lastlink
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Fee: 5% + R$1.00</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFiatDialogOpen(true)}
              >
                Configure Fiat Gateways
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Crypto Payments</CardTitle>
            <CardDescription>Accept cryptocurrency payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center flex-wrap gap-3">
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
              <PaymentIcon 
                name="USDT" 
                bgColorClass="bg-green-100 dark:bg-green-900" 
                textColorClass="text-green-600 dark:text-green-300" 
                type="circle"
              />
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Accept Bitcoin, Ethereum, USDC and other major cryptocurrencies with our integrated payment gateway or connect with Binance Pay.</p>
            </div>
            
            <div className="flex mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setCryptoDialogOpen(true)}
              >
                Configure Crypto Gateway
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <FiatGatewayDialog 
        open={fiatDialogOpen}
        onOpenChange={setFiatDialogOpen}
      />

      <CryptoGatewayDialog
        open={cryptoDialogOpen}
        onOpenChange={setCryptoDialogOpen}
      />
      
      <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg text-center mt-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Info className="h-4 w-4 text-blue-500" />
          <h3 className="text-lg font-medium">Need a custom solution?</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Contact our team to discuss enterprise solutions, custom features, or special payment gateway requirements.
        </p>
        <Button variant="default" className="bg-purple-600 hover:bg-purple-700">Contact Sales</Button>
      </div>
    </div>
  );
};

export default PaymentOptionsSection;
