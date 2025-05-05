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
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);
  const { toast } = useToast();
  const { viewAs, setViewAs } = useViewContext();
  const { t } = useTranslation('common');
  const translate = t as (key: string) => string;

  const handleViewChange = (newView: 'admin' | 'member' | 'premium' | 'premiumPlus') => {
    setViewAs(newView);

    var description = t('dashboard.viewingAsDescription', {
      defaultValue: 'You are viewing as {{role}}',
      role: newView
    }) as string;

    toast({
      title: `${translate('dashboard.viewingAs')} ${newView.charAt(0).toUpperCase() + newView.slice(1)}`,
      description: `${description}`,
      duration: 3000,
    });
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{translate('dashboard.title')}</h1>
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
                {translate('dashboard.viewAsAdmin')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('member')}>
                {translate('dashboard.viewAsFreeMember')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('premium')}>
                {translate('dashboard.viewAsPremiumMember')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange('premiumPlus')}>
                {translate('dashboard.viewAsPremiumPlusMember')}
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
            <span>{translate('dashboard.createSpace')}</span>
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
            <CommunityOverview />

            {/* AI Suggestions */}
            <AISuggestions />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Setup Checklist */}
            {viewAs === 'admin' ? <SetupChecklist /> : (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-medium text-lg mb-2">{translate('dashboard.memberResources')}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {translate('dashboard.memberResourcesDesc')}
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-left">
                    {translate('dashboard.communityGuidelines')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {translate('dashboard.memberDirectory')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {translate('dashboard.upcomingEvents')}
                  </Button>
                </div>
              </div>
            )}

            {/* Mini Calendar */}
            <MiniCalendar />
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
