
import React from 'react';
import { MessageSquare, FileText, Layout, Shield, Workflow, Bot } from 'lucide-react';
import SettingsMenuItem from '../SettingsMenuItem';

interface ContentManagementSectionProps {
  activeSection?: string;
}

const ContentManagementSection: React.FC<ContentManagementSectionProps> = ({ activeSection }) => {
  return (
    <div className="space-y-1 px-2">
      <SettingsMenuItem 
        icon={<MessageSquare size={18} />} 
        label="Marketing" 
        to="/settings/marketing" 
        active={activeSection === "marketing"} 
      />
      <SettingsMenuItem 
        icon={<FileText size={18} />} 
        label="Posts" 
        to="/settings/posts" 
        active={activeSection === "posts"} 
      />
      <SettingsMenuItem 
        icon={<Layout size={18} />} 
        label="Spaces" 
        to="/settings/spaces" 
        active={activeSection === "spaces"} 
      />
      <SettingsMenuItem 
        icon={<Shield size={18} />} 
        label="Moderation" 
        to="/settings/moderation" 
        active={activeSection === "moderation"} 
      />
      <SettingsMenuItem 
        icon={<Workflow size={18} />} 
        label="Workflows" 
        to="/settings/workflows" 
        active={activeSection === "workflows"} 
      />
      <SettingsMenuItem 
        icon={<Bot size={18} />} 
        label="AI Agents" 
        to="/settings/ai-agents" 
        active={activeSection === "ai-agents"} 
      />
    </div>
  );
};

export default ContentManagementSection;
