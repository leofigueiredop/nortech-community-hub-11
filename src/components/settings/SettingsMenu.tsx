
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  Palette, 
  Smartphone, 
  Layout, 
  DollarSign,
  Globe,
  Bot,
  MessageSquare,
  FileText,
  Mail,
  KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  color: string;
}

const SettingsCategory: React.FC<SettingsCategoryProps> = ({ 
  icon, 
  title, 
  description, 
  to,
  color
}) => {
  return (
    <Link to={to} className="no-underline">
      <div className="flex items-start p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
        <div className={`p-3 rounded-lg ${color} mr-4 flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-base mb-1">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
};

interface SettingsMenuProps {
  className?: string;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ className }) => {
  const categories = [
    {
      icon: <Settings className="h-5 w-5 text-white" />,
      title: "General",
      description: "Basic community settings and preferences",
      to: "/settings/general",
      color: "bg-gray-700"
    },
    {
      icon: <Palette className="h-5 w-5 text-white" />,
      title: "Branding",
      description: "Logo, colors, and visual identity",
      to: "/settings/branding",
      color: "bg-purple-600"
    },
    {
      icon: <Smartphone className="h-5 w-5 text-white" />,
      title: "Mobile",
      description: "Mobile app configuration",
      to: "/settings/mobile",
      color: "bg-blue-600"
    },
    {
      icon: <Layout className="h-5 w-5 text-white" />,
      title: "Defaults",
      description: "Default settings for new content",
      to: "/settings/defaults",
      color: "bg-indigo-600"
    },
    {
      icon: <DollarSign className="h-5 w-5 text-white" />,
      title: "Plans",
      description: "Subscription plans and pricing",
      to: "/settings/plans",
      color: "bg-green-600"
    },
    {
      icon: <Globe className="h-5 w-5 text-white" />,
      title: "Domain",
      description: "Custom domain configuration",
      to: "/settings/domain",
      color: "bg-yellow-600"
    },
    {
      icon: <Bot className="h-5 w-5 text-white" />,
      title: "AI Agents",
      description: "Configure AI assistants for your community",
      to: "/settings/ai-agents",
      color: "bg-pink-600"
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-white" />,
      title: "Messaging",
      description: "Community messaging preferences",
      to: "/settings/messaging",
      color: "bg-teal-600"
    },
    {
      icon: <FileText className="h-5 w-5 text-white" />,
      title: "Legal",
      description: "Terms of service and privacy policy",
      to: "/settings/legal",
      color: "bg-red-600"
    },
    {
      icon: <Mail className="h-5 w-5 text-white" />,
      title: "Digest",
      description: "Email digest configuration",
      to: "/settings/digest",
      color: "bg-orange-600"
    },
    {
      icon: <KeyRound className="h-5 w-5 text-white" />,
      title: "SSO",
      description: "Single sign-on integration",
      to: "/settings/sso",
      color: "bg-cyan-600"
    }
  ];
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {categories.map((category, index) => (
        <SettingsCategory key={index} {...category} />
      ))}
    </div>
  );
};

export default SettingsMenu;
