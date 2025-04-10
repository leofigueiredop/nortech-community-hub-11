
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Spaces: React.FC = () => {
  return (
    <MainLayout title="Spaces">
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">Spaces</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Browse and join community spaces. This page is currently under construction.
        </p>
      </div>
    </MainLayout>
  );
};

export default Spaces;
