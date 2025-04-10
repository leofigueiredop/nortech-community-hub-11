
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Explore: React.FC = () => {
  return (
    <MainLayout title="Explore">
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">Explore Page</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Discover content, spaces, and members in your community. This page is currently under construction.
        </p>
      </div>
    </MainLayout>
  );
};

export default Explore;
