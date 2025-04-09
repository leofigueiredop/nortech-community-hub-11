
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AITerminal from '@/components/ai/AITerminal';

const AITerminalPage: React.FC = () => {
  return (
    <MainLayout title="AI Assistant">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-10">
        <h1 className="text-2xl font-semibold mb-6 text-center">Community AI Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-lg mb-8">
          Ask questions about events, courses, members, and community resources. 
          Our AI assistant has been trained on all of your community's content.
        </p>
        <AITerminal />
      </div>
    </MainLayout>
  );
};

export default AITerminalPage;
