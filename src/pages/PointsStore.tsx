
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PointsStoreComponent from '@/components/points/store/PointsStore';

const PointsStore: React.FC = () => {
  return (
    <MainLayout title="Points Store">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-6">Points Redemption Store</h1>
        <PointsStoreComponent />
      </div>
    </MainLayout>
  );
};

export default PointsStore;
