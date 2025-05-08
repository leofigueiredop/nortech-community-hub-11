import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Settings, Palette, Globe, RefreshCw, 
  MessageSquare, FileText, Layout, Shield, Workflow, Bot, Trophy,
  CreditCard, DollarSign, BarChart3, Share2, Bell, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const settingsGroups = [
  {
    title: '🛠 Community Setup',
    description: 'Configure the foundational setup of your community',
    items: [
      { name: 'General Settings', icon: <Settings className="mr-2 h-5 w-5" />, path: '/settings/general', description: 'Basic community configuration and options' },
      { name: 'Branding', icon: <Palette className="mr-2 h-5 w-5" />, path: '/settings/branding', description: 'Customize the look and feel of your community' },
      { name: 'Domain', icon: <Globe className="mr-2 h-5 w-5" />, path: '/settings/domain', description: 'Connect and manage custom domains' },
      { name: 'Migration', icon: <RefreshCw className="mr-2 h-5 w-5" />, path: '/settings/migration', description: 'Import or export community data' },
    ],
    requiredRole: 'admin' // owner or admin
  },
  {
    title: '🧩 Content & Engagement',
    description: 'Manage how content is created, automated, moderated and gamified',
    items: [
      { name: 'Marketing', icon: <MessageSquare className="mr-2 h-5 w-5" />, path: '/settings/marketing', description: 'Tools to grow and promote your community' },
      { name: 'Posts', icon: <FileText className="mr-2 h-5 w-5" />, path: '/settings/posts', description: 'Configure post types and settings' },
      { name: 'Spaces', icon: <Layout className="mr-2 h-5 w-5" />, path: '/settings/spaces', description: 'Organize community content into spaces' },
      { name: 'Moderation', icon: <Shield className="mr-2 h-5 w-5" />, path: '/settings/moderation', description: 'Tools to maintain community standards' },
      { name: 'Workflows', icon: <Workflow className="mr-2 h-5 w-5" />, path: '/settings/workflows', description: 'Automate community processes and actions' },
      { name: 'AI Agents', icon: <Bot className="mr-2 h-5 w-5" />, path: '/settings/ai-agents', description: 'Configure AI assistants for your community' },
      { name: 'Points Configuration', icon: <Trophy className="mr-2 h-5 w-5" />, path: '/settings/points-configuration', description: 'Set up gamification and rewards' },
    ],
    requiredRole: 'moderator' // owner, admin, or moderator with can_edit_user_content permission
  },
  {
    title: '💸 Monetization',
    description: 'Manage pricing, track revenue and activate growth tools',
    items: [
      { name: 'Nortech Plans', icon: <CreditCard className="mr-2 h-5 w-5" />, path: '/settings/plans', description: 'Configure subscription plans and pricing' },
      { name: 'Member Subscriptions', icon: <DollarSign className="mr-2 h-5 w-5" />, path: '/settings/subscriptions', description: 'Manage member subscription settings' },
      { name: 'Paywall Setup', icon: <DollarSign className="mr-2 h-5 w-5" />, path: '/settings/paywall', description: 'Configure content access rules' },
      { name: 'Analytics', icon: <BarChart3 className="mr-2 h-5 w-5" />, path: '/settings/analytics', description: 'Community growth and engagement metrics' },
      { name: 'Affiliates', icon: <Share2 className="mr-2 h-5 w-5" />, path: '/settings/affiliates', description: 'Manage affiliate programs and tracking' },
    ],
    requiredRole: 'admin' // owner or admin
  },
  {
    title: '🧑‍🤝‍🧑 Member Experience',
    description: 'Configure how members interact, receive messages and see legal terms',
    items: [
      { name: 'Legal', icon: <FileText className="mr-2 h-5 w-5" />, path: '/settings/legal', description: 'Manage terms of service and privacy policies' },
      { name: 'Notifications', icon: <Bell className="mr-2 h-5 w-5" />, path: '/settings/notifications', description: 'Manage notification preferences' },
    ],
    requiredRole: 'admin' // owner or admin
  }
];

const SettingsMenu: React.FC = () => {
  const [pinnedItems, setPinnedItems] = useState<string[]>(["analytics", "branding"]);
  const { user } = useAuth();

  if (!user) return null;

  // Get the effective role - prefer communityRole if exists, otherwise use role
  const effectiveRole = user.communityRole || user.role || 'member';
  
  // Role-based permission checks
  const isOwner = effectiveRole === 'owner';
  const isAdmin = effectiveRole === 'admin' || isOwner;
  const isModerator = effectiveRole === 'moderator' || isAdmin;
  
  // Moderator-specific permission checks
  const canManageUsers = isAdmin || (isModerator && user.moderatorPermissions?.can_ban_users);
  const canManageContent = isAdmin || (isModerator && user.moderatorPermissions?.can_edit_user_content);
  
  // If user shouldn't access settings, don't render anything
  if (!isModerator) {
    return null;
  }
  
  const togglePin = (itemName: string) => {
    setPinnedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  // Filter settings groups based on user role
  const filteredSettingsGroups = settingsGroups.filter(group => {
    if (group.requiredRole === 'admin' && !isAdmin) return false;
    if (group.requiredRole === 'moderator' && !isModerator) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Pinned settings section */}
      {pinnedItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 text-amber-400" />
            <h2 className="font-semibold text-lg">Pinned Settings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSettingsGroups.flatMap(group => 
              group.items.filter(item => 
                pinnedItems.includes(item.name.toLowerCase())
              ).map((item) => (
                <Link key={`pinned-${item.name.toLowerCase()}`} to={item.path}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex items-center gap-3">
                    <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto" 
                      onClick={(e) => {
                        e.preventDefault();
                        togglePin(item.name.toLowerCase());
                      }}
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </Button>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main settings groups */}
      {filteredSettingsGroups.map((group, index) => (
        <div key={index}>
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 pb-2">
            <h2 className="text-xl font-bold">{group.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{group.description}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map((item, itemIndex) => (
              <Link key={itemIndex} to={item.path}>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow h-full">
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 mr-3">
                      {item.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.preventDefault();
                        togglePin(item.name.toLowerCase());
                      }}
                    >
                      <Star className={`h-4 w-4 ${pinnedItems.includes(item.name.toLowerCase()) ? 'fill-amber-400 text-amber-400' : 'text-gray-400'}`} />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Core settings navigation */}
      <nav className="space-y-1 border-t border-gray-200 dark:border-gray-700 pt-4">
        <NavLink
          to="/settings/profile"
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md flex items-center ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`
          }
        >
          <User className="mr-2 h-4 w-4" />
          Profile Settings
        </NavLink>

        {isModerator && (
          <NavLink
            to="/settings/community"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md flex items-center ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <Settings className="mr-2 h-4 w-4" />
            Community Settings
          </NavLink>
        )}

        {canManageUsers && (
          <NavLink
            to="/settings/users"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md flex items-center ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <User className="mr-2 h-4 w-4" />
            User Management
          </NavLink>
        )}

        {canManageContent && (
          <NavLink
            to="/settings/content"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md flex items-center ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            Content Management
          </NavLink>
        )}

        {isAdmin && (
          <>
            <NavLink
              to="/settings/roles"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md flex items-center ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Shield className="mr-2 h-4 w-4" />
              Role Management
            </NavLink>

            <NavLink
              to="/settings/advanced"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md flex items-center ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              Advanced Settings
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default SettingsMenu;
