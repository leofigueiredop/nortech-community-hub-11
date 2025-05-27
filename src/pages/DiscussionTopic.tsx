import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useViewContext } from '@/components/layout/MainLayout';
import { useRealDiscussions } from '@/hooks/useRealDiscussions';
import Discussion from '@/components/discussions/Discussion';
import CreateDiscussionDialog from '@/components/discussions/CreateDiscussionDialog';
import DiscussionFilters from '@/components/discussions/DiscussionFilters';
import ActiveUsersList from '@/components/discussions/ActiveUsersList';
import { DiscussionFilter } from '@/types/discussion';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';

const DiscussionTopic = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<DiscussionFilter[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { viewAs } = useViewContext();
  const { user } = useAuth();
  const { 
    loadDiscussionsByTopic,
    currentTopic,
    discussions,
    loading,
    filterDiscussions
  } = useRealDiscussions();
  
  // Load topic data and discussions
  useEffect(() => {
    if (topicId) {
      loadDiscussionsByTopic(topicId);
    }
  }, [topicId, loadDiscussionsByTopic]);
  
  // Filter discussions based on search, filters, and active tab
  const getFilteredDiscussions = () => {
    // Apply all active filters
    let filtered = filterDiscussions(activeFilters);
    
    // Apply search filter if set
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(discussion => 
        discussion.title.toLowerCase().includes(query) || 
        (discussion.content && discussion.content.toLowerCase().includes(query)) ||
        (discussion.description && discussion.description.toLowerCase().includes(query)) ||
        (discussion.tags && discussion.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply tab filters
    switch (activeTab) {
      case 'recent':
        return [...filtered].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'popular':
        return [...filtered].filter(d => d.isHot || (d.upvotes && d.upvotes > 5));
      case 'answered':
        return [...filtered].filter(d => d.isAnswered);
      default:
        return filtered;
    }
  };
  
  // Qualquer usuário autenticado pode criar discussões
  const canCreateDiscussion = !!user;
  
  // Handle back button click
  const handleBackClick = () => {
    navigate('/discussions');
  };
  
  // Get filtered discussions
  const filteredDiscussions = getFilteredDiscussions();
  
  if (loading) {
    return (
      <MainLayout title="Discussion Topic">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!currentTopic) {
    return (
      <MainLayout title="Topic Not Found">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <h2 className="text-xl font-semibold">Topic not found</h2>
          <p className="text-muted-foreground">The topic you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Discussions
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title={currentTopic.title || currentTopic.name}>
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={handleBackClick}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Discussions
      </Button>
      
      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{currentTopic.title || currentTopic.name}</h1>
              <p className="text-muted-foreground">{currentTopic.description}</p>
            </div>
            
            {canCreateDiscussion && (
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus size={16} className="mr-2" />
                New Discussion
              </Button>
            )}
          </div>
          
          <DiscussionFilters 
            topicId={topicId || ''}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterChange={setActiveFilters}
            activeFilters={activeFilters}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="answered">Answered</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4 space-y-4">
              {filteredDiscussions.length > 0 ? (
                filteredDiscussions.map(discussion => (
                  <Discussion 
                    key={discussion.id} 
                    discussion={discussion}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No discussions found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent" className="mt-4 space-y-4">
              {filteredDiscussions.length > 0 ? (
                filteredDiscussions.map(discussion => (
                  <Discussion 
                    key={discussion.id} 
                    discussion={discussion}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent discussions found.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular" className="mt-4 space-y-4">
              {filteredDiscussions.length > 0 ? (
                filteredDiscussions.map(discussion => (
                  <Discussion 
                    key={discussion.id} 
                    discussion={discussion}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No popular discussions found.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="answered" className="mt-4 space-y-4">
              {filteredDiscussions.length > 0 ? (
                filteredDiscussions.map(discussion => (
                  <Discussion 
                    key={discussion.id} 
                    discussion={discussion}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No answered discussions found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="hidden md:block">
          <div className="sticky top-24">
            <h2 className="text-lg font-semibold mb-4">About This Topic</h2>
            <div className="bg-card rounded-lg p-4 shadow-sm border mb-6">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground mb-4">{currentTopic.description}</p>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-muted-foreground">
                    {new Date(currentTopic.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Discussions:</span>
                  <span className="text-muted-foreground">{filteredDiscussions.length}</span>
                </div>
              </div>
            </div>
            
            <ActiveUsersList />
          </div>
        </div>
      </div>
      
      {/* Discussion creation dialog */}
      {currentTopic && (
        <CreateDiscussionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          topic={currentTopic}
          onDiscussionCreated={() => loadDiscussionsByTopic(topicId || '')}
        />
      )}
    </MainLayout>
  );
};

export default DiscussionTopic;
