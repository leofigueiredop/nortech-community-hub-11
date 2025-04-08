
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import SetupChecklist from '@/components/dashboard/SetupChecklist';
import QuickActions from '@/components/dashboard/QuickActions';
import CreateSpaceDialog from '@/components/dashboard/CreateSpaceDialog';
import { Button } from '@/components/ui/button';
import { Eye, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);
  const { toast } = useToast();

  const handleViewAsMember = () => {
    toast({
      title: "Viewing as Member",
      description: "You are now viewing your community as a regular member would see it.",
      duration: 3000,
    });
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={handleViewAsMember}
          >
            <Eye size={16} />
            <span>View as Member</span>
          </Button>
          
          <Button 
            className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
            onClick={() => setCreateSpaceOpen(true)}
          >
            <PlusCircle size={16} />
            <span>Create Space</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <WelcomeCard />
          <QuickActions />
        </div>
        <div>
          <SetupChecklist />
        </div>
      </div>

      <CreateSpaceDialog 
        open={createSpaceOpen} 
        onOpenChange={setCreateSpaceOpen} 
      />
    </MainLayout>
  );
};

export default Dashboard;
