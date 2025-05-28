import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Settings, Palette, Globe, RefreshCw, Layout, MessageSquare, FileText, Shield, 
  Workflow, Bot, Trophy, CreditCard, DollarSign, BarChart3, Share2, Bell, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SettingsMenuItem from './SettingsMenuItem';
import { useTheme } from '@/context/ThemeContext';

interface SettingsSidebarProps {
  activeSection?: string;
}

const SectionDivider = () => (
  <div className="h-px bg-gray-200 dark:bg-gray-700 mx-3 my-3" />
);

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection = "general" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedItems, setPinnedItems] = useState(["branding", "analytics"]);
  const { colors } = useTheme();
  
  const togglePin = (sectionName: string) => {
    setPinnedItems(prev => 
      prev.includes(sectionName) 
        ? prev.filter(item => item !== sectionName)
        : [...prev, sectionName]
    );
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white overflow-y-auto">
      <div className="p-3 sticky top-0 z-10 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search settings..."
            className="pl-9 bg-white dark:bg-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {pinnedItems.length > 0 && (
        <div className="pt-3">
          <div 
            className="px-3 pb-1 text-xs font-semibold flex items-center gap-2"
            style={{ color: colors.primaryColor }}
          >
            <Star className="h-3.5 w-3.5" style={{ color: colors.primaryColor }} />
            PINNED ITEMS
          </div>
          <div className="space-y-1 px-2">
            {pinnedItems.includes("branding") && (
              <SettingsMenuItem 
                icon={<Palette size={18} />} 
                label="Branding" 
                to="/settings/branding" 
                active={activeSection === "branding"} 
                onPin={() => togglePin("branding")}
                isPinned={true}
              />
            )}
            {pinnedItems.includes("analytics") && (
              <SettingsMenuItem 
                icon={<BarChart3 size={18} />} 
                label="Analytics" 
                to="/settings/analytics" 
                active={activeSection === "analytics"} 
                onPin={() => togglePin("analytics")}
                isPinned={true}
              />
            )}
          </div>
        </div>
      )}

      <div className="pt-3">
        <div className="px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Settings className="h-3.5 w-3.5" />
          COMMUNITY SETUP
        </div>
        <div className="space-y-1 px-2">
          <SettingsMenuItem 
            icon={<Settings size={18} />} 
            label="General" 
            to="/settings/general" 
            active={activeSection === "general"} 
            onPin={() => togglePin("general")}
            isPinned={pinnedItems.includes("general")}
          />
          <SettingsMenuItem 
            icon={<Palette size={18} />} 
            label="Branding" 
            to="/settings/branding" 
            active={activeSection === "branding"} 
            onPin={() => togglePin("branding")}
            isPinned={pinnedItems.includes("branding")}
          />
          <SettingsMenuItem 
            icon={<Globe size={18} />} 
            label="Domain" 
            to="/settings/domain" 
            active={activeSection === "domain"} 
            onPin={() => togglePin("domain")}
            isPinned={pinnedItems.includes("domain")}
          />
          <SettingsMenuItem 
            icon={<RefreshCw size={18} />} 
            label="Migration" 
            to="/settings/migration" 
            active={activeSection === "migration"} 
            onPin={() => togglePin("migration")}
            isPinned={pinnedItems.includes("migration")}
          />
        </div>
      </div>
      
      <SectionDivider />
      
      <div className="pt-3">
        <div className="px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Layout className="h-3.5 w-3.5" />
          CONTENT & ENGAGEMENT
        </div>
        <div className="space-y-1 px-2">
          <SettingsMenuItem 
            icon={<MessageSquare size={18} />} 
            label="Marketing" 
            to="/settings/marketing" 
            active={activeSection === "marketing"} 
            onPin={() => togglePin("marketing")}
            isPinned={pinnedItems.includes("marketing")}
          />
          <SettingsMenuItem 
            icon={<FileText size={18} />} 
            label="Posts" 
            to="/settings/posts" 
            active={activeSection === "posts"} 
            onPin={() => togglePin("posts")}
            isPinned={pinnedItems.includes("posts")}
          />
          <SettingsMenuItem 
            icon={<Layout size={18} />} 
            label="Spaces" 
            to="/settings/spaces" 
            active={activeSection === "spaces"} 
            onPin={() => togglePin("spaces")}
            isPinned={pinnedItems.includes("spaces")}
          />
          <SettingsMenuItem 
            icon={<Shield size={18} />} 
            label="Moderation" 
            to="/settings/moderation" 
            active={activeSection === "moderation"} 
            onPin={() => togglePin("moderation")}
            isPinned={pinnedItems.includes("moderation")}
          />
          <SettingsMenuItem 
            icon={<Workflow size={18} />} 
            label="Workflows" 
            to="/settings/workflows" 
            active={activeSection === "workflows"} 
            onPin={() => togglePin("workflows")}
            isPinned={pinnedItems.includes("workflows")}
          />
          <SettingsMenuItem 
            icon={<Bot size={18} />} 
            label="AI Agents" 
            to="/settings/ai-agents" 
            active={activeSection === "ai-agents"} 
            onPin={() => togglePin("ai-agents")}
            isPinned={pinnedItems.includes("ai-agents")}
          />
          <SettingsMenuItem 
            icon={<Trophy size={18} />} 
            label="Points Configuration" 
            to="/settings/points-configuration" 
            active={activeSection === "points-configuration"} 
            onPin={() => togglePin("points-configuration")}
            isPinned={pinnedItems.includes("points-configuration")}
          />
        </div>
      </div>
      
      <SectionDivider />
      
      <div className="pt-3">
        <div className="px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <CreditCard className="h-3.5 w-3.5" />
          MONETIZATION
        </div>
        <div className="space-y-1 px-2">
          <SettingsMenuItem 
            icon={<CreditCard size={18} />} 
            label="Nortech Plans" 
            to="/settings/plans" 
            active={activeSection === "plans"} 
            onPin={() => togglePin("plans")}
            isPinned={pinnedItems.includes("plans")}
          />
          <SettingsMenuItem 
            icon={<Key size={18} />} 
            label="Billing & Payments" 
            to="/settings/billing" 
            active={activeSection === "billing"} 
            onPin={() => togglePin("billing")}
            isPinned={pinnedItems.includes("billing")}
          />
          <SettingsMenuItem 
            icon={<DollarSign size={18} />} 
            label="Member Subscriptions" 
            to="/settings/subscriptions" 
            active={activeSection === "subscriptions"} 
            onPin={() => togglePin("subscriptions")}
            isPinned={pinnedItems.includes("subscriptions")}
          />
          <SettingsMenuItem 
            icon={<DollarSign size={18} />} 
            label="Paywall Setup" 
            to="/settings/paywall" 
            active={activeSection === "paywall"} 
            onPin={() => togglePin("paywall")}
            isPinned={pinnedItems.includes("paywall")}
          />
          <SettingsMenuItem 
            icon={<BarChart3 size={18} />} 
            label="Analytics" 
            to="/settings/analytics" 
            active={activeSection === "analytics"} 
            onPin={() => togglePin("analytics")}
            isPinned={pinnedItems.includes("analytics")}
          />
          <SettingsMenuItem 
            icon={<Share2 size={18} />} 
            label="Affiliates" 
            to="/settings/affiliates" 
            active={activeSection === "affiliates"} 
            onPin={() => togglePin("affiliates")}
            isPinned={pinnedItems.includes("affiliates")}
          />
        </div>
      </div>
      
      <SectionDivider />
      
      <div className="pt-3">
        <div className="px-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5" />
          MEMBER EXPERIENCE
        </div>
        <div className="space-y-1 px-2">
          <SettingsMenuItem 
            icon={<FileText size={18} />} 
            label="Legal" 
            to="/settings/legal" 
            active={activeSection === "legal"} 
            onPin={() => togglePin("legal")}
            isPinned={pinnedItems.includes("legal")}
          />
          <SettingsMenuItem 
            icon={<Bell size={18} />} 
            label="Notifications" 
            to="/settings/notifications" 
            active={activeSection === "notifications"} 
            onPin={() => togglePin("notifications")}
            isPinned={pinnedItems.includes("notifications")}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
