
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface WorkflowStep {
  order: number;
  title: string;
  day?: number | string;
  iconColor: string;
  enabled: boolean;
}

interface WorkflowDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: {
    title: string;
    description: string;
    steps: WorkflowStep[];
  } | null;
  onStepToggle: (stepOrder: number) => void;
}

const WorkflowDetailModal: React.FC<WorkflowDetailModalProps> = ({
  isOpen,
  onClose,
  workflow,
  onStepToggle
}) => {
  if (!workflow) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{workflow.title}</DialogTitle>
          <DialogDescription>
            {workflow.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <h3 className="text-sm font-medium">Workflow Steps</h3>
          <div className="space-y-3">
            {workflow.steps.map((step) => (
              <div 
                key={step.order}
                className="flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{ backgroundColor: `${step.iconColor}20`, color: step.iconColor }}
                  >
                    {step.order}
                  </div>
                  <div className="flex flex-col">
                    <span>{step.title}</span>
                    {step.day !== undefined && (
                      <span className="text-xs text-gray-500">Day {step.day}</span>
                    )}
                  </div>
                </div>
                <Switch 
                  checked={step.enabled} 
                  onCheckedChange={() => onStepToggle(step.order)}
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" disabled>
            Edit Details (Coming Soon)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowDetailModal;
