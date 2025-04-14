
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/content-creator/DashboardHeader';
import DashboardTabs from '@/components/content-creator/DashboardTabs';

const ContentCreatorDashboard: React.FC = () => {
  return (
    <MainLayout title="Content Creator Dashboard">
      <div className="container py-6 space-y-8">
        <DashboardHeader />
        <DashboardTabs />
      </div>
    </MainLayout>
  );
};

export default ContentCreatorDashboard;
