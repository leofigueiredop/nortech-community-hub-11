
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import CommunityAISettings from '@/components/settings/CommunityAISettings';

const AIAgents: React.FC = () => {
  return (
    <SettingsLayout activeSection="ai-agents" title="AI Agents">
      <CommunityAISettings />
    </SettingsLayout>
  );
};

export default AIAgents;
