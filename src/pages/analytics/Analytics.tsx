import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { OverviewCards } from './components/OverviewCards';
import { GrowthCharts } from './components/GrowthCharts';
import { EngagementCharts } from './components/EngagementCharts';
import { useAuth } from '@/context/AuthContext';

const Analytics = () => {
  const { user } = useAuth();

  return (
    <MainLayout title="Analytics">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <AnalyticsHeader />
        
        <div className="space-y-8">
          <OverviewCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GrowthCharts />
            <EngagementCharts />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics; 