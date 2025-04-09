
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LeaderboardComponent from '@/components/points/Leaderboard';

const Leaderboard: React.FC = () => {
  return (
    <MainLayout title="Leaderboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-6">Ranking da Comunidade</h1>
        <LeaderboardComponent />
      </div>
    </MainLayout>
  );
};

export default Leaderboard;
