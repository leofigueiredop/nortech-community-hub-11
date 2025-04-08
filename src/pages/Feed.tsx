
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EmptyFeed from '@/components/feed/EmptyFeed';

const Feed: React.FC = () => {
  return (
    <MainLayout title="Feed">
      <EmptyFeed />
    </MainLayout>
  );
};

export default Feed;
