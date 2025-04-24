
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const SupportCTA: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <h4 className="font-medium text-sm">Need help with a large migration?</h4>
        <p className="text-xs text-muted-foreground">
          Our team can assist with complex or large-scale migrations.
        </p>
      </div>
      <Button variant="outline" size="sm" className="gap-1.5 whitespace-nowrap">
        <HelpCircle className="h-3.5 w-3.5" />
        Contact Support
      </Button>
    </div>
  );
};

export default SupportCTA;
