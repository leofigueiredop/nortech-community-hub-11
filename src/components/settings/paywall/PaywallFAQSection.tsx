
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaywallFAQSection: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Which template should I use?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose <strong>Simple & Clean</strong> for a straightforward approach with minimal distractions. 
                  Select <strong>Featured Content</strong> if you want to highlight the benefits of your premium content.
                  Use <strong>Premium Offer</strong> when you want to emphasize the value and price point of your offer.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I connect my payment gateway?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Click the "Configure" button under the payment gateway section. You'll need to provide your API keys 
                  from your payment provider. We support direct integration with Stripe, PayPal, and several other 
                  providers. For specific regional payment methods, contact our support team.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I show a preview of my premium content?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! Enable the "Partial content preview" option in the Content Preview section. 
                  You can also apply a blur effect to give users a glimpse of what they're missing 
                  without revealing all the details. This often increases conversion rates.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I customize the call-to-action button?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Click the "Customize" button on your selected template. In the customization panel, 
                  you can edit the button text, color, and style. Compelling CTAs like "Get Instant Access" 
                  or "Join Now" often perform better than generic text like "Subscribe."
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Can I A/B test different paywalls?</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Currently, you can manually switch between different templates and track conversions. 
                  Automated A/B testing will be available soon with our AI-powered features, which will 
                  automatically optimize your paywall for maximum conversions.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaywallFAQSection;
