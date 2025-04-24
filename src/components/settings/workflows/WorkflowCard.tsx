
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Copy, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WorkflowStep {
  order: number;
  title: string;
  day?: number | string;
  iconColor: string;
  enabled?: boolean;
}

interface WorkflowCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'active' | 'paused' | 'coming-soon';
  steps: WorkflowStep[];
  impactCount?: number;
  tags?: string[];
  onToggleStatus: () => void;
  onDuplicate: () => void;
  onViewDetails: () => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  icon,
  title,
  description,
  status,
  steps,
  impactCount,
  tags,
  onToggleStatus,
  onDuplicate,
  onViewDetails,
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            <span>{title}</span>
          </CardTitle>
          <div className="flex items-center gap-1">
            <StatusBadge status={status} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0" 
                    disabled={status === 'coming-soon'}
                    onClick={onToggleStatus}
                  >
                    {status === 'paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {status === 'paused' ? 'Activate workflow' : 'Pause workflow'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <div 
              key={step.order} 
              className="flex items-center gap-2 border-l-2 pl-3 py-1" 
              style={{ borderColor: step.iconColor }}
            >
              <div 
                className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium"
                style={{ backgroundColor: `${step.iconColor}20`, color: step.iconColor }}
              >
                {step.order}
              </div>
              <div className="flex flex-col">
                <span className="text-sm">{step.title}</span>
                {step.day !== undefined && (
                  <span className="text-xs text-gray-500">Day {step.day}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {(impactCount || tags) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-gray-500">
            {impactCount && (
              <div className="bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 px-2 py-0.5 rounded-full">
                🔥 {impactCount.toLocaleString()} users impacted
              </div>
            )}
            {tags && tags.map(tag => (
              <div key={tag} className="bg-indigo-50 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                {tag}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={status === 'coming-soon'}
                  onClick={onDuplicate}
                >
                  <Copy className="h-4 w-4 mr-1" /> Duplicate
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Create a copy of this workflow
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewDetails}
                >
                  <ExternalLink className="h-4 w-4 mr-1" /> Details
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                View workflow details
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;
