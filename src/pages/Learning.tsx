
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Learning: React.FC = () => {
  return (
    <MainLayout title="Learning">
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">Learning Paths</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Access educational content and structured learning paths. This page is currently under construction.
        </p>
      </div>
    </MainLayout>
  );
};

export default Learning;
