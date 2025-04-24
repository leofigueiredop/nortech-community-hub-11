
import React from 'react';
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Check, X } from 'lucide-react';

interface Feature {
  name: string;
  tooltip: string;
  starter: string | boolean;
  professional: string | boolean;
  business: string | boolean;
  enterprise: string | boolean;
  whiteLabel: string | boolean;
}

interface ComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  features: Feature[];
  isMobile: boolean;
}

const ComparisonDialog: React.FC<ComparisonDialogProps> = ({
  open,
  onOpenChange,
  features,
  isMobile
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[900px]">
        <DialogHeader>
          <DialogTitle>Comparação detalhada dos planos</DialogTitle>
          <DialogDescription>
            Veja todos os recursos disponíveis em cada plano
          </DialogDescription>
        </DialogHeader>
        
        <div className={isMobile ? "overflow-x-auto" : ""}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recursos</TableHead>
                <TableHead>Starter</TableHead>
                <TableHead>Professional</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.name}>
                  <TableCell className="font-medium whitespace-nowrap">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 cursor-help">
                            {feature.name}
                            <Info size={14} className="text-gray-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{feature.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  {['starter', 'professional', 'business', 'enterprise'].map((planKey) => (
                    <TableCell key={planKey}>
                      {typeof feature[planKey] === 'string' ? (
                        <span>{feature[planKey]}</span>
                      ) : (
                        feature[planKey] ? (
                          <Check size={18} className="text-green-500" />
                        ) : (
                          <X size={18} className="text-gray-400" />
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonDialog;
