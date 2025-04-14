
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Settings, Palette, Smartphone, ListChecks, Globe, Bot, 
  MessageSquare, Share2, ArrowLeftRight, Bell, Trophy
} from 'lucide-react';

const settingsGroups = [
  {
    title: 'General',
    items: [
      { name: 'General Settings', icon: <Settings className="mr-2 h-4 w-4" />, path: '/settings/general' },
      { name: 'Branding', icon: <Palette className="mr-2 h-4 w-4" />, path: '/settings/branding' },
      { name: 'Mobile App', icon: <Smartphone className="mr-2 h-4 w-4" />, path: '/settings/mobile' },
      { name: 'Defaults', icon: <ListChecks className="mr-2 h-4 w-4" />, path: '/settings/defaults' },
    ]
  },
  {
    title: 'Content & Engagement',
    items: [
      { name: 'Points Configuration', icon: <Trophy className="mr-2 h-4 w-4" />, path: '/settings/points-configuration' },
      { name: 'Domain', icon: <Globe className="mr-2 h-4 w-4" />, path: '/settings/domain' },
    ]
  },
  {
    title: 'AI & Integrations',
    items: [
      { name: 'AI Agents', icon: <Bot className="mr-2 h-4 w-4" />, path: '/settings/ai-agents' },
      { name: 'Integration', icon: <Share2 className="mr-2 h-4 w-4" />, path: '/settings/integration' },
    ]
  },
  {
    title: 'Communication',
    items: [
      { name: 'Messaging', icon: <MessageSquare className="mr-2 h-4 w-4" />, path: '/settings/messaging' },
      { name: 'Notifications', icon: <Bell className="mr-2 h-4 w-4" />, path: '/settings/notifications' },
    ]
  },
  {
    title: 'Technical',
    items: [
      { name: 'Migration', icon: <ArrowLeftRight className="mr-2 h-4 w-4" />, path: '/settings/migration' },
    ]
  }
];

const SettingsMenu: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {settingsGroups.map((group, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">{group.title}</h3>
          </div>
          <div className="p-3">
            {group.items.map((item, itemIndex) => (
              <Link key={itemIndex} to={item.path}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start mb-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SettingsMenu;
