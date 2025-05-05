import React from 'react';
import { BarChart3 } from 'lucide-react';

export const AnalyticsHeader = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-indigo-600" />
        <h1 className="text-2xl font-semibold">Analytics</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-3xl">
        Track your community growth, engagement, and key performance indicators.
      </p>
    </div>
  );
}; 