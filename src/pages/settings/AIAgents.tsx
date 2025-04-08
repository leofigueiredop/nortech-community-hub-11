
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import CommunityAISettings from '@/components/settings/CommunityAISettings';

const AIAgents: React.FC = () => {
  return (
    <SettingsLayout activeSection="ai-agents">
      <CommunityAISettings />
    </SettingsLayout>
  );
};

export default AIAgents;
