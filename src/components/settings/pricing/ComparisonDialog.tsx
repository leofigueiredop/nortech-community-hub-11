
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Plan } from './PricingPlans';

interface Feature {
  name: string;
  tooltip?: string;
  starter: string | boolean;
  professional: string | boolean;
  business: string | boolean;
  enterprise: string | boolean;
  whiteLabel?: string | boolean;
}

export interface ComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  features: Feature[];
  isMobile?: boolean;
}

export const ComparisonDialog: React.FC<ComparisonDialogProps> = ({ 
  features, 
  open, 
  onOpenChange,
  isMobile = false
}) => {
  // Plan names for column headers
  const planNames = ['Starter', 'Professional', 'Business', 'Enterprise', 'White Label'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Comparação de Planos</DialogTitle>
          <DialogDescription>
            Compare recursos e escolha o plano ideal para a sua comunidade
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recurso
                </th>
                {planNames.map((planName, index) => (
                  <th 
                    key={index}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider 
                      ${index === 1 ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}
                  >
                    {planName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
              {features.map((feature, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-1">
                    {feature.name}
                    {feature.tooltip && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${planNames[0] === 'Professional' ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    {typeof feature.starter === 'boolean' ? (
                      feature.starter ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )
                    ) : (
                      <span>{feature.starter}</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${planNames[1] === 'Professional' ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    {typeof feature.professional === 'boolean' ? (
                      feature.professional ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )
                    ) : (
                      <span>{feature.professional}</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${planNames[2] === 'Professional' ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    {typeof feature.business === 'boolean' ? (
                      feature.business ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )
                    ) : (
                      <span>{feature.business}</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${planNames[3] === 'Professional' ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    {typeof feature.enterprise === 'boolean' ? (
                      feature.enterprise ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )
                    ) : (
                      <span>{feature.enterprise}</span>
                    )}
                  </td>
                  {feature.whiteLabel !== undefined && (
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${planNames[4] === 'Professional' ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                      {typeof feature.whiteLabel === 'boolean' ? (
                        feature.whiteLabel ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400" />
                        )
                      ) : (
                        <span>{feature.whiteLabel}</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
