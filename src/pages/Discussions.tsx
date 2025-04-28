
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useViewContext } from '@/components/layout/MainLayout';
import { useDiscussions } from '@/hooks/useDiscussions';
import TopicCard from '@/components/discussions/TopicCard';
import DiscussionCard from '@/components/discussions/DiscussionCard';
import CreateTopicDialog from '@/components/discussions/CreateTopicDialog';
import DiscussionFilters from '@/components/discussions/DiscussionFilters';
import ActiveUsersList from '@/components/discussions/ActiveUsersList';
import { DiscussionFilter } from '@/types/discussion';

const Discussions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('topics');
  const [activeFilters, setActiveFilters] = useState<DiscussionFilter[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { viewAs } = useViewContext();
  const { 
    getAllTopics, 
    getDiscussions, 
    filterDiscussions
  } = useDiscussions();
  
  const topics = getAllTopics();
  
  // Combine all discussions for "recent" and "popular" tabs
  const allDiscussions = topics.flatMap(topic => 
    getDiscussions(topic.id).map(discussion => ({
      ...discussion,
      topicId: topic.id
    }))
  );
  
  // Filter discussions based on search query and active filters
  const filteredDiscussions = allDiscussions.filter(discussion => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply active filters
    const matchesFilters = activeFilters.length === 0 || activeFilters.every(filter => {
      switch (filter.type) {
        case 'tag':
          return discussion.tags.includes(filter.value);
        case 'status':
          if (filter.value === 'hot') return discussion.isHot;
          if (filter.value === 'answered') return discussion.isAnswered;
          if (filter.value === 'unanswered') return !discussion.isAnswered;
          return true;
        case 'time':
          // Simple time filter based on activity string
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
    
    return matchesSearch && matchesFilters;
  });
  
  // Sort by recent activity for the "recent" tab
  const recentDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (a.lastActivity.includes('agora')) return -1;
    if (b.lastActivity.includes('agora')) return 1;
    if (a.lastActivity.includes('minuto') && !b.lastActivity.includes('minuto')) return -1;
    if (!a.lastActivity.includes('minuto') && b.lastActivity.includes('minuto')) return 1;
    if (a.lastActivity.includes('hora') && b.lastActivity.includes('dia')) return -1;
    if (a.lastActivity.includes('dia') && b.lastActivity.includes('hora')) return 1;
    return 0;
  });
  
  // Filter for popular/hot discussions
  const popularDiscussions = filteredDiscussions.filter(d => d.isHot);
  
  // Determine if user can create topics (admin or moderator)
  const canCreateTopic = viewAs === 'admin' || viewAs === 'moderator';

  return (
    <MainLayout title="Discussions">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Fóruns de Discussão</h1>
          {canCreateTopic && (
            <CreateTopicDialog 
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
            />
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <DiscussionFilters 
              topicId="" 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterChange={setActiveFilters}
              activeFilters={activeFilters}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList>
                <TabsTrigger value="topics">Tópicos</TabsTrigger>
                <TabsTrigger value="recent">Discussões Recentes</TabsTrigger>
                <TabsTrigger value="popular">Populares</TabsTrigger>
              </TabsList>
              <TabsContent value="topics" className="mt-4">
                <h2 className="text-lg font-semibold mb-4">Tópicos da Comunidade</h2>
                {topics.length > 0 ? (
                  topics.map(topic => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Não há tópicos disponíveis no momento.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="recent" className="mt-4">
                <h2 className="text-lg font-semibold mb-4">Discussões Recentes</h2>
                {recentDiscussions.length > 0 ? (
                  recentDiscussions.map(discussion => (
                    <DiscussionCard 
                      key={discussion.id} 
                      discussion={discussion} 
                      topicId={discussion.topicId} 
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Não há discussões recentes no momento.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="popular" className="mt-4">
                <h2 className="text-lg font-semibold mb-4">Discussões Populares</h2>
                {popularDiscussions.length > 0 ? (
                  popularDiscussions.map(discussion => (
                    <DiscussionCard 
                      key={discussion.id} 
                      discussion={discussion} 
                      topicId={discussion.topicId} 
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Não há discussões populares no momento.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <ActiveUsersList />
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <h3 className="text-sm font-medium mb-3">Sobre os Fóruns</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Participe das discussões da comunidade, faça perguntas, ajude outros membros e ganhe pontos de experiência.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>• Ganhe 10 XP ao criar discussões</p>
                <p>• Ganhe 5 XP ao responder</p>
                <p>• Ganhe 15 XP quando sua resposta for aceita</p>
                <p>• Ganhe 2 XP por cada upvote recebido</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Discussions;
