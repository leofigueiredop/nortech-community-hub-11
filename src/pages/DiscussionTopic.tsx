import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useViewContext } from '@/components/layout/MainLayout';
import { useDiscussions } from '@/hooks/useDiscussions';
import DiscussionCard from '@/components/discussions/DiscussionCard';
import CreateDiscussionDialog from '@/components/discussions/CreateDiscussionDialog';
import DiscussionFilters from '@/components/discussions/DiscussionFilters';
import ActiveUsersList from '@/components/discussions/ActiveUsersList';
import { Discussion, DiscussionFilter, DiscussionTopic as DiscussionTopicType } from '@/types/discussion';
import { useTranslation } from 'react-i18next';

const DiscussionTopic = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<DiscussionFilter[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { viewAs } = useViewContext();
  const { 
    getTopic, 
    getDiscussions, 
    filterDiscussions 
  } = useDiscussions();
  const { t, i18n } = useTranslation('common');
  
  // Get topic data
  const topicData = topicId ? getTopic(topicId) : null;
  
  // Get all discussions for this topic
  const allDiscussions = topicId ? getDiscussions(topicId) : [];
  
  // Filter discussions based on search, filters, and active tab
  const getFilteredDiscussions = () => {
    if (!topicId) return [];
    
    // Apply search filter
    let filtered = allDiscussions.filter(discussion => 
      searchQuery === '' || 
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Apply active filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(discussion => {
        return activeFilters.every(filter => {
          switch (filter.type) {
            case 'tag':
              return discussion.tags.includes(filter.value);
            case 'status':
              if (filter.value === 'hot') return discussion.isHot;
              if (filter.value === 'answered') return discussion.isAnswered;
              if (filter.value === 'unanswered') return !discussion.isAnswered;
              return true;
            case 'time':
              if (filter.value === 'today') 
                return discussion.lastActivity.includes('hora') || 
                      discussion.lastActivity.includes('minuto') || 
                      discussion.lastActivity.includes('agora');
              if (filter.value === 'week') 
                return !discussion.lastActivity.includes('mês');
              return true;
            case 'format':
              return discussion.format === filter.value;
            default:
              return true;
          }
        });
      });
    }
    
    // Apply tab filter
    switch (activeTab) {
      case 'active':
        return filtered.filter(d => 
          d.lastActivity.includes('hora') || 
          d.lastActivity.includes('minuto') || 
          d.lastActivity.includes('agora')
        );
      case 'popular':
        return filtered.filter(d => d.isHot);
      case 'unanswered':
        return filtered.filter(d => d.format === 'question' && !d.isAnswered);
      default:
        return filtered;
    }
  };
  
  const filteredDiscussions = getFilteredDiscussions();
  
  // Determine if user can create discussions
  const canCreateDiscussion = viewAs === 'admin' || viewAs === 'moderator' || viewAs === 'user';
  
  // Handle if topic doesn't exist
  useEffect(() => {
    if (!topicData && topicId) {
      toast({
        title: t('discussions.topic.notFound'),
        description: t('discussions.topic.notFoundDesc'),
        variant: "destructive",
        duration: 3000,
      });
      navigate('/discussions');
    }
  }, [topicId, topicData, toast, navigate]);

  // Memoize the translated title so it updates on language change
  const mainLayoutTitle = React.useMemo(
    () => t('discussions.topic.pageTitle', { topic: topicData?.name }),
    [t, topicData?.name, i18n.language]
  );

  if (!topicData) {
    return null;
  }

  return (
    <MainLayout title={mainLayoutTitle}>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => navigate('/discussions')}
          >
            <ArrowLeft size={16} />
            <span key={i18n.language}>{t('discussions.topic.backToTopics')}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">{topicData.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{topicData.description}</p>
              </div>
              
              {canCreateDiscussion && (
                <CreateDiscussionDialog 
                  topic={topicData}
                  open={isDialogOpen} 
                  onOpenChange={setIsDialogOpen}
                />
              )}
            </div>
            
            <DiscussionFilters 
              topicId={topicId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterChange={setActiveFilters}
              activeFilters={activeFilters}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList>
                <TabsTrigger value="all">{t('discussions.topic.tabs.all')}</TabsTrigger>
                <TabsTrigger value="active">{t('discussions.topic.tabs.active')}</TabsTrigger>
                <TabsTrigger value="popular">{t('discussions.topic.tabs.popular')}</TabsTrigger>
                <TabsTrigger value="unanswered">{t('discussions.topic.tabs.unanswered')}</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                {filteredDiscussions.length > 0 ? (
                  filteredDiscussions.map(discussion => (
                    <DiscussionCard key={discussion.id} discussion={discussion} topicId={topicId} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('discussions.topic.noDiscussionsWithFilters')}</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                {filteredDiscussions.length > 0 ? (
                  filteredDiscussions.map(discussion => (
                    <DiscussionCard key={discussion.id} discussion={discussion} topicId={topicId} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('discussions.topic.noActiveDiscussions')}</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="popular" className="mt-4">
                {filteredDiscussions.length > 0 ? (
                  filteredDiscussions.map(discussion => (
                    <DiscussionCard key={discussion.id} discussion={discussion} topicId={topicId} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('discussions.topic.noPopularDiscussions')}</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="unanswered" className="mt-4">
                {filteredDiscussions.length > 0 ? (
                  filteredDiscussions.map(discussion => (
                    <DiscussionCard key={discussion.id} discussion={discussion} topicId={topicId} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('discussions.topic.noUnansweredDiscussions')}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <ActiveUsersList />
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <h3 className="text-sm font-medium mb-3">{t('discussions.topic.aboutTitle')}</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>{t('discussions.topic.members')}:</strong> {topicData.memberCount}</p>
                <p><strong>{t('discussions.topic.discussions')}:</strong> {topicData.discussionCount}</p>
                <p><strong>{t('discussions.topic.createdAt')}:</strong> {new Date(topicData.createdAt || topicData.created_at).toLocaleDateString('pt-BR')}</p>
                <p><strong>{t('discussions.topic.recentActivity')}:</strong> {topicData.recentActivity}</p>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">{t('discussions.topic.rulesTitle')}</h4>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  <li>{t('discussions.topic.rules.respect')}</li>
                  <li>{t('discussions.topic.rules.relevant')}</li>
                  <li>{t('discussions.topic.rules.noInappropriate')}</li>
                  <li>{t('discussions.topic.rules.checkBeforeCreate')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DiscussionTopic;
