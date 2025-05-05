import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { MatchmakerHeader } from './components/MatchmakerHeader';
import { MatchmakerTabs } from './components/MatchmakerTabs';
import { useAuth } from '@/context/AuthContext';

const AIMatchmaker = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout title="AI Matchmaker">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <MatchmakerHeader />
        <MatchmakerTabs />
      </div>
    </MainLayout>
  );
};

export default AIMatchmaker; 