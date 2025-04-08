
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import CommunityAISettings from '@/components/settings/CommunityAISettings';
import { Sparkles } from 'lucide-react';

const AIAgents: React.FC = () => {
  return (
    <SettingsLayout activeSection="ai-agents" title="AI Intelligence">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Community AI Platform</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure AI-powered features to enhance your community engagement, provide valuable insights, automate content generation,
          and connect members through intelligent recommendations.
        </p>
        
        <CommunityAISettings />
      </div>
    </SettingsLayout>
  );
};

export default AIAgents;
