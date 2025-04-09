
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PointsDashboardComponent from '@/components/points/PointsDashboard';

const PointsDashboard: React.FC = () => {
  return (
    <MainLayout title="Points & Rewards">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-6">Points & Rewards</h1>
        <PointsDashboardComponent />
      </div>
    </MainLayout>
  );
};

export default PointsDashboard;
