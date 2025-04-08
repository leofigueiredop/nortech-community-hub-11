
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, FileText, Calendar, Settings, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  const actions = [
    {
      title: 'Create Post',
      icon: <FileText size={18} />,
      onClick: () => navigate('/create-post'),
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Invite Members',
      icon: <Users size={18} />,
      onClick: () => navigate('/invite'),
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      title: 'Schedule Event',
      icon: <Calendar size={18} />,
      onClick: () => navigate('/events/create'),
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Create Space',
      icon: <PlusCircle size={18} />,
      onClick: () => navigate('/create-space'),
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500'
    },
    {
      title: 'Customize Brand',
      icon: <Settings size={18} />,
      onClick: () => navigate('/settings/branding'),
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-500'
    },
    {
      title: 'Send Announcement',
      icon: <Megaphone size={18} />,
      onClick: () => navigate('/announcements/new'),
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-500'
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
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
              <div className={`${action.bgColor} ${action.iconColor} p-2 rounded-full`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
