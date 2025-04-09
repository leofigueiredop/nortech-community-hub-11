
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
  KeyRound,
  ExternalLink,
  ArrowRightLeft,
  CreditCard,
  Users,
  Monitor,
  Code,
  BarChart3,
  Share,
  Shield,
  Video,
  Workflow
} from 'lucide-react';

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
  // Group categories by section, matching the sidebar organization
  const technicalCategories = [
    {
      icon: <Users className="h-5 w-5 text-white" />,
      title: "Audience",
      description: "Manage your target audience and community members",
      to: "/settings/audience",
      color: "bg-blue-600"
    },
    {
      icon: <ExternalLink className="h-5 w-5 text-white" />,
      title: "Integration",
      description: "Connect with third-party services",
      to: "/settings/integration",
      color: "bg-blue-400"
    },
    {
      icon: <ArrowRightLeft className="h-5 w-5 text-white" />,
      title: "Migration",
      description: "Import or export your community data",
      to: "/settings/migration",
      color: "bg-fuchsia-600"
    },
    {
      icon: <Monitor className="h-5 w-5 text-white" />,
      title: "Site",
      description: "Configure your site appearance and behavior",
      to: "/settings/site",
      color: "bg-slate-600"
    },
    {
      icon: <Code className="h-5 w-5 text-white" />,
      title: "Developers",
      description: "Access developer tools and API documentation",
      to: "/settings/developers",
      color: "bg-gray-700"
    },
    {
      icon: <Settings className="h-5 w-5 text-white" />,
      title: "General",
      description: "Basic community settings and preferences",
      to: "/settings/general",
      color: "bg-gray-700"
    }
  ];

  const contentCategories = [
    {
      icon: <MessageSquare className="h-5 w-5 text-white" />,
      title: "Marketing",
      description: "Manage your marketing campaigns and resources",
      to: "/settings/marketing",
      color: "bg-amber-600"
    },
    {
      icon: <FileText className="h-5 w-5 text-white" />,
      title: "Posts",
      description: "Configure post settings and defaults",
      to: "/settings/posts",
      color: "bg-cyan-600"
    },
    {
      icon: <Layout className="h-5 w-5 text-white" />,
      title: "Spaces",
      description: "Manage community spaces and areas",
      to: "/settings/spaces",
      color: "bg-emerald-600"
    },
    {
      icon: <Shield className="h-5 w-5 text-white" />,
      title: "Moderation",
      description: "Community moderation tools and settings",
      to: "/settings/moderation",
      color: "bg-red-600"
    },
    {
      icon: <Video className="h-5 w-5 text-white" />,
      title: "Live",
      description: "Configure live streaming and events",
      to: "/settings/live",
      color: "bg-indigo-600"
    },
    {
      icon: <Workflow className="h-5 w-5 text-white" />,
      title: "Workflows",
      description: "Set up automated community workflows",
      to: "/settings/workflows",
      color: "bg-green-600"
    },
    {
      icon: <Bot className="h-5 w-5 text-white" />,
      title: "AI Agents",
      description: "Configure AI assistants for your community",
      to: "/settings/ai-agents",
      color: "bg-pink-600"
    }
  ];

  const monetizationCategories = [
    {
      icon: <CreditCard className="h-5 w-5 text-white" />,
      title: "Nortech Plans",
      description: "Your platform subscription options",
      to: "/settings/plans",
      color: "bg-green-600"
    },
    {
      icon: <DollarSign className="h-5 w-5 text-white" />,
      title: "Member Subscriptions",
      description: "Plans for your community members",
      to: "/settings/subscriptions",
      color: "bg-emerald-600"
    },
    {
      icon: <DollarSign className="h-5 w-5 text-white" />,
      title: "Paywall Setup",
      description: "Configure monetization options",
      to: "/settings/paywall",
      color: "bg-violet-600"
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-white" />,
      title: "Analytics",
      description: "Track community performance and metrics",
      to: "/settings/analytics",
      color: "bg-blue-600"
    },
    {
      icon: <Share className="h-5 w-5 text-white" />,
      title: "Affiliates",
      description: "Manage affiliate programs and partnerships",
      to: "/settings/affiliates",
      color: "bg-orange-600"
    },
  ];

  const preferencesCategories = [
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
      icon: <Globe className="h-5 w-5 text-white" />,
      title: "Domain",
      description: "Custom domain configuration",
      to: "/settings/domain",
      color: "bg-yellow-600"
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-white" />,
      title: "Messaging",
      description: "Community messaging preferences",
      to: "/settings/messaging",
      color: "bg-teal-600"
    }
  ];

  const memberCategories = [
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
  
  // Combine all categories for rendering
  const allCategories = [
    {
      title: "Community Management",
      categories: technicalCategories
    },
    {
      title: "Content Management",
      categories: contentCategories
    },
    {
      title: "Monetization",
      categories: monetizationCategories
    },
    {
      title: "Community Preferences",
      categories: preferencesCategories
    },
    {
      title: "Member Experience",
      categories: memberCategories
    }
  ];

  return (
    <div className={`space-y-10 ${className}`}>
      {allCategories.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.categories.map((category, index) => (
              <SettingsCategory key={index} {...category} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SettingsMenu;
