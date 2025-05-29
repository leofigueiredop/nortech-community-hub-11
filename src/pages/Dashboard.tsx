import React, { useState } from 'react';
import MainLayout, { useViewContext } from '@/components/layout/MainLayout';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import SetupChecklist from '@/components/dashboard/SetupChecklist';
import QuickActions from '@/components/dashboard/QuickActions';
import CommunityOverview from '@/components/dashboard/CommunityOverview';
import AISuggestions from '@/components/dashboard/AISuggestions';
import MiniCalendar from '@/components/dashboard/MiniCalendar';
import CreateSpaceDialog from '@/components/dashboard/CreateSpaceDialog';
import GuidedTour from '@/components/dashboard/GuidedTour';
import { Button } from '@/components/ui/button';
import { PlusCircle, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Dashboard: React.FC = () => {
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);
  const { toast } = useToast();
  const { viewAs, setViewAs } = useViewContext();

  // Estado para eventos futuros
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  // Função para receber eventos do CommunityOverview
  const handleUpcomingEvents = (events: any[]) => {
    setUpcomingEvents(events);
  };

  const handleViewChange = (newView: 'admin' | 'member' | 'premium' | 'premiumPlus') => {
    setViewAs(newView);

    toast({
      title: `Viewing as ${newView.charAt(0).toUpperCase() + newView.slice(1)}`,
      description: `You are now viewing your community as a ${newView} would see it.`,
      duration: 3000,
    });
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-purple-100 hover:text-purple-600"
              >
                <Eye size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleViewChange('admin')}>
                View as Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('member')}>
                View as Free Member
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('premium')}>
                View as Premium Member
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('premiumPlus')}>
                View as Premium+ Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      <div className="grid grid-cols-1 gap-6">
        {/* Welcome Banner */}
        <WelcomeCard />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Actions */}
            {viewAs === 'admin' && <QuickActions />}

            {/* Community Overview */}
            <CommunityOverview onUpcomingEvents={handleUpcomingEvents} />

            {/* AI Suggestions */}
            <AISuggestions />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Setup Checklist */}
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

            {/* Mini Calendar - passe os eventos se quiser */}
            <MiniCalendar events={upcomingEvents} />
          </div>
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