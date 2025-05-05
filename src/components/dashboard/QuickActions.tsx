import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, FileText, Calendar, Palette, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  
  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleInviteMembers = () => {
    // Navigate to members page with invite tab active
    navigate('/members');
    toast({
      title: "Invite feature",
      description: "The invite members dialog will appear here.",
    });
  };

  const handleScheduleEvent = () => {
    navigate('/create-event');
  };

  const handleCreateSpace = () => {
    navigate('/create-space');
  };

  const handleCustomizeBrand = () => {
    navigate('/settings/branding');
  };

  const handleSendAnnouncement = () => {
    // Since there's no specific announcements page, we'll navigate to feed
    navigate('/feed');
    toast({
      title: "Announcements",
      description: "You can create announcements from the feed page.",
    });
  };
  
  const actions = [
    {
      title: t('common:dashboard.quickActions.createPost'),
      icon: <FileText size={18} />,
      emoji: '📝',
      onClick: handleCreatePost,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      description: t('common:dashboard.quickActions.shareIdeas')
    },
    {
      title: t('common:dashboard.quickActions.inviteMembers'),
      icon: <Users size={18} />,
      emoji: '📨',
      onClick: handleInviteMembers,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      description: t('common:dashboard.quickActions.growCommunity')
    },
    {
      title: t('common:dashboard.quickActions.scheduleEvent'),
      icon: <Calendar size={18} />,
      emoji: '📅',
      onClick: handleScheduleEvent,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      description: t('common:dashboard.quickActions.hostSession')
    },
    {
      title: t('common:dashboard.quickActions.createSpace'),
      icon: <PlusCircle size={18} />,
      emoji: '🧩',
      onClick: handleCreateSpace,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
      description: t('common:dashboard.quickActions.organizeTopics')
    },
    {
      title: t('common:dashboard.quickActions.customizeBrand'),
      icon: <Palette size={18} />,
      emoji: '🎨',
      onClick: handleCustomizeBrand,
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-500',
      description: t('common:dashboard.quickActions.personalizeLook')
    },
    {
      title: t('common:dashboard.quickActions.sendAnnouncement'),
      icon: <Megaphone size={18} />,
      emoji: '📢',
      onClick: handleSendAnnouncement,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-500',
      description: t('common:dashboard.quickActions.alertAll')
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('common:dashboard.quickActions.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col h-auto gap-2 py-4 justify-center border-dashed hover:border-nortech-purple hover:bg-nortech-light-purple"
              onClick={action.onClick}
            >
              <div className="flex items-center gap-2">
                <div className={`${action.bgColor} ${action.iconColor} p-2 rounded-full`}>
                  {action.icon}
                </div>
                <span className="text-xl">{action.emoji}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{action.title}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
