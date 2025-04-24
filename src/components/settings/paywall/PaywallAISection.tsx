
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

const PaywallAISection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Card className="relative overflow-hidden mb-8 border-dashed">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-500" />
                AI-Powered Paywall
              </CardTitle>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800">
                Coming Soon
              </Badge>
            </div>
          </div>
          <CardDescription>
            Let AI optimize your conversion rates and paywall effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white/80 dark:bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-purple-200 dark:border-purple-900">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-medium mb-2">Smart Paywall Generation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AI creates paywall content based on your premium offerings
                </p>
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-medium mb-2">Dynamic Pricing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Intelligent price recommendations based on your audience
                </p>
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-medium mb-2">A/B Testing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automated tests to optimize conversion rates
                </p>
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-medium mb-2">Recovery Alerts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Smart offers for users who abandon subscription process
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4">
              <Button disabled className="bg-purple-600 opacity-70">
                <Zap className="h-4 w-4 mr-2" />
                Enable AI Features (Soon)
              </Button>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                Learn more about AI features
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaywallAISection;
