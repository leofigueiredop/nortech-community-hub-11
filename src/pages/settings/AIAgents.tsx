
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import CommunityAISettings from '@/components/settings/CommunityAISettings';

const AIAgents: React.FC = () => {
  return (
    <SettingsLayout activeSection="ai-agents" title="AI Intelligence">
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure AI-powered features to enhance your community engagement and provide valuable insights.
        </p>
        
        <CommunityAISettings />
      </div>
    </SettingsLayout>
  );
};

export default AIAgents;
