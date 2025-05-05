import React from 'react';
import { Users } from 'lucide-react';

export const MatchmakerHeader = () => {
  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-indigo-600" />
        <h1 className="text-2xl font-semibold">AI Matchmaker</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-3xl">
        Connect with other community members based on shared interests, goals, and activities. 
        Our AI analyzes profiles and interactions to suggest meaningful connections.
      </p>
    </>
  );
}; 