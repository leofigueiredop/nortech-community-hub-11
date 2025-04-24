
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentOptionsSection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto mb-12">
      <Card>
        <CardHeader>
          <CardTitle>Payment Options</CardTitle>
          <CardDescription>Payment options have been moved to Subscription Settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please manage payment gateways and options in the Subscriptions section.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentOptionsSection;
