import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Layout, TrendingUp } from 'lucide-react';
import { SupabaseCommunityRepository } from '@/api/repositories/SupabaseCommunityRepository';
import { supabase } from '@/lib/supabase';

const COMMUNITY_ID = '1170657f-6bd6-4819-afd6-0e83cf863efd';
interface CommunityOverviewProps {
  onUpcomingEvents?: (events: any[]) => void;
}

const CommunityOverview: React.FC<CommunityOverviewProps> = ({ onUpcomingEvents }) => {
  const [totalMembers, setTotalMembers] = useState<string>('...');
  const [activeSpaces, setActiveSpaces] = useState<string>('...');
  const [postsThisWeek, setPostsThisWeek] = useState<string>('...');
  const [engagement, setEngagement] = useState<{ level: string; badgeColor: string; emoji: string }>({
    level: 'Medium',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    emoji: '🟡'
  });
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchTotalMembers = async () => {
      try {
        const repo = new SupabaseCommunityRepository(supabase);
        const result = await repo.getAllMembers(COMMUNITY_ID);
        setTotalMembers(Array.isArray(result.data) ? result.data.length.toString() : '0');
      } catch (error) {
        setTotalMembers('0');
      }
    };

    const fetchActiveSpaces = async () => {
      try {
        const repo = new SupabaseCommunityRepository(supabase);
        const result = await repo.getActiveSpaces(COMMUNITY_ID);
        setActiveSpaces(result.ok ? result.data.toString() : '0');
      } catch (error) {
        setActiveSpaces('0');
      }
    };

    const fetchPostsThisWeek = async () => {
      try {
        const repo = new SupabaseCommunityRepository(supabase);
        const result = await repo.getPostsThisWeek(COMMUNITY_ID);
        setPostsThisWeek(result.ok ? result.data.toString() : '0');
      } catch (error) {
        setPostsThisWeek('0');
      }
    };

    const fetchUpcomingEvents = async () => {
      const repo = new SupabaseCommunityRepository(supabase);
      const result = await repo.getUpcomingEvents(COMMUNITY_ID);
      if (result.ok) {
        setUpcomingEvents(result.data);
        if (onUpcomingEvents) onUpcomingEvents(result.data);
      } else {
        setUpcomingEvents([]);
        if (onUpcomingEvents) onUpcomingEvents([]);
      }
    };

    const fetchEngagementLevel = async () => {
      try {
        const since = new Date();
        since.setDate(since.getDate() - 7);

        // Busca comentários da semana
        const { count: commentsCount, error: commentsError } = await supabase
          .from('post_comments')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', since.toISOString())
          .eq('community_id', COMMUNITY_ID);

        // Busca reações da semana
        const { count: reactionsCount, error: reactionsError } = await supabase
          .from('post_reactions')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', since.toISOString())
          .eq('community_id', COMMUNITY_ID);

        // Busca posts da semana
        const { count: postsCount, error: postsError } = await supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', since.toISOString())
          .eq('community_id', COMMUNITY_ID);

        if (commentsError || reactionsError || postsError) throw new Error('Erro ao buscar dados de engajamento');

        const comments = commentsCount ?? 0;
        const reactions = reactionsCount ?? 0;
        const posts = postsCount ?? 1; // evita divisão por zero

        const ratio = (comments + reactions) / posts;

        if (ratio >= 2) {
          setEngagement({
            level: 'Good',
            badgeColor: 'bg-green-100 text-green-800',
            emoji: '🟢'
          });
        } else if (ratio >= 1) {
          setEngagement({
            level: 'Medium',
            badgeColor: 'bg-yellow-100 text-yellow-800',
            emoji: '🟡'
          });
        } else {
          setEngagement({
            level: 'Bad',
            badgeColor: 'bg-red-100 text-red-800',
            emoji: '🔴'
          });
        }
      } catch (error) {
        setEngagement({
          level: 'Bad',
          badgeColor: 'bg-red-100 text-red-800',
          emoji: '🔴'
        });
      }
    };

    fetchTotalMembers();
    fetchActiveSpaces();
    fetchPostsThisWeek();
    fetchEngagementLevel();
    fetchUpcomingEvents();
  }, [onUpcomingEvents]);

  const stats = [
    {
      title: 'Total Members',
      value: totalMembers,
      icon: <Users className="h-4 w-4" />,
      description: 'All-time joined users',
      change: '+12% (30d)'
    },
    {
      title: 'Active Spaces',
      value: activeSpaces,
      icon: <Layout className="h-4 w-4" />,
      description: 'Spaces with engagement this week',
      change: 'No change'
    },
    {
      title: 'Posts this week',
      value: postsThisWeek,
      icon: <FileText className="h-4 w-4" />,
      description: 'New posts created in last 7 days',
      change: '+8% (7d)'
    },
    {
      title: 'Engagement Level',
      value: engagement.level,
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Calculated by views/comments ratio',
      badgeColor: engagement.badgeColor,
      emoji: engagement.emoji
    }
  ];

  return (
    <>
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
                className="p-4 rounded-lg border border-border bg-background flex justify-between flex-col"
                style={
                  stat.title === 'Engagement Level'
                    ? { minHeight: '120px', minWidth: '180px' }
                    : {}
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    {stat.icon} {stat.title}
                  </span>
                  {/* Só mostra o badge no topo se NÃO for Engagement Level */}
                  {stat.badgeColor && stat.title !== 'Engagement Level' ? (
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${stat.badgeColor} flex items-center`}
                      style={{ fontSize: '0.85rem' }}
                    >
                      {stat.emoji} <span className="ml-1">{stat.value}</span>
                    </span>
                  ) : (
                    !stat.badgeColor && (
                      <span className="text-xs text-muted-foreground">{stat.change}</span>
                    )
                  )}
                </div>
                <div className="mt-1 flex flex-col">
                  {!stat.badgeColor && (
                    <div className="text-2xl font-bold">{stat.value}</div>
                  )}
                  {stat.badgeColor && stat.title === 'Engagement Level' && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${stat.badgeColor} w-fit`}
                      style={{ fontSize: '0.85rem' }}
                    >
                      {stat.emoji} <span className="ml-1">{stat.value}</span>
                    </span>
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
    </>
  );
};

export default CommunityOverview;