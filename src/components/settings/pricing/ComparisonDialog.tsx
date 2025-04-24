
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
import { Check, X } from 'lucide-react';
import { Plan } from './PricingPlans';

interface ComparisonDialogProps {
  plans: Plan[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ComparisonDialog: React.FC<ComparisonDialogProps> = ({ plans, open, setOpen }) => {
  const features = [
    { name: 'Membros inclusos', values: {1: '100', 2: '1.000', 3: '10.000', 4: 'Ilimitado', 5: 'Ilimitado'} },
    { name: 'Cursos e Salas', values: {1: false, 2: true, 3: true, 4: true, 5: true} },
    { name: 'Workflows', values: {1: false, 2: false, 3: true, 4: true, 5: true} },
    { name: 'Agentes IA / Terminal', values: {1: false, 2: false, 3: false, 4: true, 5: true} },
    { name: 'API / Campos Customizados', values: {1: false, 2: false, 3: true, 4: true, 5: true} },
    { name: 'White-label e App próprio', values: {1: false, 2: false, 3: false, 4: false, 5: true} },
    { name: 'Suporte Prioritário', values: {1: false, 2: false, 3: false, 4: true, 5: true} }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                {plans.map((plan) => (
                  <th 
                    key={plan.id}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider 
                      ${plan.recommended ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
              {features.map((feature, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {feature.name}
                  </td>
                  {plans.map((plan) => (
                    <td 
                      key={plan.id} 
                      className={`px-6 py-4 whitespace-nowrap text-sm ${plan.recommended ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}
                    >
                      {typeof feature.values[plan.id as keyof typeof feature.values] === 'boolean' ? (
                        feature.values[plan.id as keyof typeof feature.values] ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400" />
                        )
                      ) : (
                        <span>{feature.values[plan.id as keyof typeof feature.values]}</span>
                      )}
                    </td>
                  ))}
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
