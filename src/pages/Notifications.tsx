
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Notifications: React.FC = () => {
  return (
    <MainLayout title="Notifications">
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          View your community notifications and activity updates. This page is currently under construction.
        </p>
      </div>
    </MainLayout>
  );
};

export default Notifications;
