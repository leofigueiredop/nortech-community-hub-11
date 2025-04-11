
import React, { useState } from 'react';
import MainLayout, { useViewContext } from '@/components/layout/MainLayout';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import SetupChecklist from '@/components/dashboard/SetupChecklist';
import QuickActions from '@/components/dashboard/QuickActions';
import CreateSpaceDialog from '@/components/dashboard/CreateSpaceDialog';
import GuidedTour from '@/components/dashboard/GuidedTour';
import { Button } from '@/components/ui/button';
import { Eye, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);
  const { toast } = useToast();
  const { viewAs, setViewAs } = useViewContext();

  const handleViewAsMember = () => {
    setViewAs(viewAs === 'admin' ? 'member' : 'admin');
    
    toast({
      title: `Viewing as ${viewAs === 'admin' ? 'Member' : 'Admin'}`,
      description: `You are now viewing your community as a ${viewAs === 'admin' ? 'regular member' : 'admin'} would see it.`,
      duration: 3000,
    });
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button 
            variant={viewAs === 'admin' ? "ghost" : "outline"} 
            size="icon" 
            className={`h-8 w-8 rounded-full ${viewAs !== 'admin' ? "bg-purple-100 text-purple-600" : ""}`}
            onClick={handleViewAsMember}
            title={viewAs === 'admin' ? "View as Member" : "View as Admin"}
          >
            <Eye size={16} />
          </Button>
        </div>
        
        {viewAs === 'admin' && (
          <Button 
            className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
            onClick={() => setCreateSpaceOpen(true)}
          >
            <PlusCircle size={16} />
            <span>Create Space</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <WelcomeCard />
          {viewAs === 'admin' && <QuickActions />}
        </div>
        <div>
          {viewAs === 'admin' ? <SetupChecklist /> : (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="font-medium text-lg mb-2">Member Resources</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Find useful resources to help you get the most out of your membership.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left">
                  Community Guidelines
                </Button>
                <Button variant="outline" className="w-full justify-start text-left">
                  Member Directory
                </Button>
                <Button variant="outline" className="w-full justify-start text-left">
                  Upcoming Events
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateSpaceDialog 
        open={createSpaceOpen} 
        onOpenChange={setCreateSpaceOpen} 
      />

      {/* Add the guided tour component */}
      <GuidedTour />
    </MainLayout>
  );
};

export default Dashboard;
