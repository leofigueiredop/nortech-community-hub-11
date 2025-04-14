
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DiscussionTopic } from '@/types/discussion';
import { Clock, TrendingUp } from 'lucide-react';

interface TopicCardProps {
  topic: DiscussionTopic;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  // Map icon string to component
  const getIconComponent = () => {
    switch (topic.icon) {
      case 'TrendingUp':
        return <TrendingUp size={18} />;
      case 'Users':
        return <Users size={18} />;
      case 'Clock':
        return <Clock size={18} />;
      default:
        return <MessageSquare size={18} />;
    }
  };

  return (
    <Card className="mb-4 hover:border-nortech-purple/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-nortech-purple">
              {typeof topic.icon === 'string' ? getIconComponent() : topic.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{topic.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {topic.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MessageSquare size={14} /> {topic.discussionCount} discussões
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} /> {topic.memberCount} membros
          </span>
          <span>Atividade recente: {topic.recentActivity}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link to={`/discussions/${topic.id}`}>
          <Button variant="outline">Explorar Tópico</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TopicCard;
