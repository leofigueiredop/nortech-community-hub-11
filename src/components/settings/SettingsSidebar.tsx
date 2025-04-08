
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Layout, 
  Shield, 
  Video,
  Workflow,
  Bot,
  DollarSign,
  BarChart3,
  Share,
  Monitor,
  Code,
  Settings,
  Moon,
  Palette,
  Keyboard,
  Eye,
  UserPlus,
  ExternalLink,
  ArrowRightLeft,
  Lock
} from 'lucide-react';

interface SettingsMenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 ${
        active 
          ? "bg-gray-800 text-white rounded-md" 
          : "text-gray-300 hover:bg-gray-800 hover:text-white hover:rounded-md transition-colors"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const SectionDivider: React.FC = () => {
  return <div className="h-px bg-gray-700 my-4 mx-4"></div>;
};

interface SettingsSidebarProps {
  activeSection?: string;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection = "general" }) => {
  return (
    <div className="w-64 h-full bg-gray-900 text-white overflow-y-auto">
      <div className="p-4 mb-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Pablo's Community <span className="text-xs text-gray-400">▼</span>
        </h2>
      </div>

      <div className="space-y-1 px-2">
        <SettingsMenuItem 
          icon={<Users size={18} />} 
          label="Audience" 
          to="/settings/audience" 
          active={activeSection === "audience"} 
        />
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
          icon={<Video size={18} />} 
          label="Live" 
          to="/settings/live" 
          active={activeSection === "live"} 
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
        <SettingsMenuItem 
          icon={<DollarSign size={18} />} 
          label="Paywall" 
          to="/settings/paywall" 
          active={activeSection === "paywall"} 
        />
        <SettingsMenuItem 
          icon={<DollarSign size={18} />} 
          label="Plans" 
          to="/settings/plans" 
          active={activeSection === "plans"} 
        />
        <SettingsMenuItem 
          icon={<BarChart3 size={18} />} 
          label="Analytics" 
          to="/settings/analytics" 
          active={activeSection === "analytics"} 
        />
        <SettingsMenuItem 
          icon={<Share size={18} />} 
          label="Affiliates" 
          to="/settings/affiliates" 
          active={activeSection === "affiliates"} 
        />
        <SettingsMenuItem 
          icon={<ExternalLink size={18} />} 
          label="Integration" 
          to="/settings/integration" 
          active={activeSection === "integration"} 
        />
        <SettingsMenuItem 
          icon={<ArrowRightLeft size={18} />} 
          label="Migration" 
          to="/settings/migration" 
          active={activeSection === "migration"} 
        />
        <SettingsMenuItem 
          icon={<Monitor size={18} />} 
          label="Site" 
          to="/settings/site" 
          active={activeSection === "site"} 
        />
        <SettingsMenuItem 
          icon={<Code size={18} />} 
          label="Developers" 
          to="/settings/developers" 
          active={activeSection === "developers"} 
        />
        <SettingsMenuItem 
          icon={<Settings size={18} />} 
          label="Settings" 
          to="/settings/general" 
          active={activeSection === "general"} 
        />
      </div>

      <SectionDivider />

      <div className="space-y-1 px-2">
        <SettingsMenuItem 
          icon={<Moon size={18} />} 
          label="Switch to light mode" 
          to="/settings/theme" 
          active={false} 
        />
        <SettingsMenuItem 
          icon={<Palette size={18} />} 
          label="Customize theme" 
          to="/settings/customize" 
          active={false} 
        />
        <SettingsMenuItem 
          icon={<Keyboard size={18} />} 
          label="Keyboard shortcuts" 
          to="/settings/shortcuts" 
          active={false} 
        />
      </div>

      <SectionDivider />

      <div className="space-y-1 px-2">
        <SettingsMenuItem 
          icon={<Eye size={18} />} 
          label="View as" 
          to="/settings/view-as" 
          active={false} 
        />
        <SettingsMenuItem 
          icon={<UserPlus size={18} />} 
          label="Invite member" 
          to="/settings/invite" 
          active={false} 
        />
      </div>
    </div>
  );
};

export default SettingsSidebar;
