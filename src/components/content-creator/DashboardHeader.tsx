
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Content Creator Dashboard</h2>
      <Button variant="outline" className="gap-2">
        <ExternalLink size={16} />
        View Live Site
      </Button>
    </div>
  );
};

export default DashboardHeader;
