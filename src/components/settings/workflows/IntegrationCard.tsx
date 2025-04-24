
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IntegrationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaAction: () => void;
  color: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  icon,
  title,
  description,
  ctaLabel,
  ctaAction,
  color
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-2" style={{ backgroundColor: color }}></div>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg" 
              style={{ backgroundColor: `${color}20` }}
            >
              {icon}
            </div>
            <h3 className="font-medium">{title}</h3>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
          
          <Button 
            className="w-full mt-2"
            style={{ backgroundColor: color }}
            onClick={ctaAction}
          >
            {ctaLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
