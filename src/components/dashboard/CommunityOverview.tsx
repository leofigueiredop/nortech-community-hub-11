import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Layout, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CommunityOverview: React.FC = () => {
  const { t } = useTranslation('common');
  // Mock data - in a real app, this would come from an API or context
  const stats = [
    {
      title: t('common:dashboard.overview.totalMembers'),
      value: '138',
      icon: <Users className="h-4 w-4" />,
      description: t('common:dashboard.overview.allTimeJoined'),
      change: '+12% (30d)'
    },
    {
      title: t('common:dashboard.overview.activeSpaces'),
      value: '4',
      icon: <Layout className="h-4 w-4" />,
      description: t('common:dashboard.overview.spacesWithEngagement'),
      change: t('common:dashboard.overview.noChange')
    },
    {
      title: t('common:dashboard.overview.postsThisWeek'),
      value: '17',
      icon: <FileText className="h-4 w-4" />,
      description: t('common:dashboard.overview.newPostsLast7Days'),
      change: '+8% (7d)'
    },
    {
      title: t('common:dashboard.overview.engagementLevel'),
      value: t('common:dashboard.overview.medium'),
      icon: <TrendingUp className="h-4 w-4" />,
      description: t('common:dashboard.overview.calculatedByViews'),
      badgeColor: 'bg-yellow-100 text-yellow-800',
      emoji: '🟡'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>📊</span> {t('common:dashboard.overview.title')}
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
