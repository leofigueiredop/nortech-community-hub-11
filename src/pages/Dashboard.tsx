
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import SetupChecklist from '@/components/dashboard/SetupChecklist';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <WelcomeCard />
          <QuickActions />
        </div>
        <div>
          <SetupChecklist />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
