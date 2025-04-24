
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Layout, TrendingUp } from 'lucide-react';

const CommunityOverview: React.FC = () => {
  // Mock data - in a real app, this would come from an API or context
  const stats = [
    {
      title: 'Total Members',
      value: '138',
      icon: <Users className="h-4 w-4" />,
      description: 'All-time joined users',
      change: '+12% (30d)'
    },
    {
      title: 'Active Spaces',
      value: '4',
      icon: <Layout className="h-4 w-4" />,
      description: 'Spaces with engagement this week',
      change: 'No change'
    },
    {
      title: 'Posts this week',
      value: '17',
      icon: <FileText className="h-4 w-4" />,
      description: 'New posts created in last 7 days',
      change: '+8% (7d)'
    },
    {
      title: 'Engagement Level',
      value: 'Medium',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Calculated by views/comments ratio',
      badgeColor: 'bg-yellow-100 text-yellow-800',
      emoji: '🟡'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>📊</span> Community Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="p-4 bg-background rounded-lg border border-border flex flex-col"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  {stat.icon} {stat.title}
                </span>
                
                {stat.badgeColor ? (
                  <span className={`text-xs px-2 py-0.5 rounded ${stat.badgeColor} flex items-center`}>
                    {stat.emoji} {stat.value}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                )}
              </div>
              
              <div className="mt-1">
                {!stat.badgeColor && (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityOverview;
