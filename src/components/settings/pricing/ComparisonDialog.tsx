
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plan } from './PricingPlans';

type Feature = {
  name: string;
  tooltip?: string;
  starter: string | boolean;
  professional: string | boolean;
  business: string | boolean;
  enterprise: string | boolean;
  whiteLabel: string | boolean;
};

export interface ComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  features: Feature[];
}

export const ComparisonDialog: React.FC<ComparisonDialogProps> = ({ 
  open, 
  onOpenChange,
  features 
}) => {
  if (!features || features.length === 0) {
    return null;
  }

  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-center block">{value}</span>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[90vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Plan Comparison</DialogTitle>
          <DialogDescription>
            Compare all available plans to find the right fit for your community
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-tl-lg">Features</th>
                <th className="p-3 bg-gray-50 dark:bg-gray-800 text-center">Starter</th>
                <th className="p-3 bg-gray-50 dark:bg-gray-800 text-center">Professional</th>
                <th className="p-3 bg-gray-50 dark:bg-gray-800 text-center">Business</th>
                <th className="p-3 bg-gray-50 dark:bg-gray-800 text-center">Enterprise</th>
                <th className="p-3 bg-gray-50 dark:bg-gray-800 text-center rounded-tr-lg">White Label</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 font-medium">
                    {feature.tooltip ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1">
                            {feature.name} <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      feature.name
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">{renderValue(feature.starter)}</td>
                  <td className="py-3 px-4 text-center">{renderValue(feature.professional)}</td>
                  <td className="py-3 px-4 text-center">{renderValue(feature.business)}</td>
                  <td className="py-3 px-4 text-center">{renderValue(feature.enterprise)}</td>
                  <td className="py-3 px-4 text-center">{renderValue(feature.whiteLabel)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close Comparison</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
