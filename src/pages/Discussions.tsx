import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  MessageSquare, 
  PlusCircle, 
  TrendingUp, 
  Loader2,
  Search 
} from 'lucide-react';
import { useRealDiscussions } from '@/hooks/useRealDiscussions';
import { useAuth } from '@/context/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DiscussionTopic } from '@/types/discussion';
import CreateTopicDialog from '@/components/discussions/CreateTopicDialog';

const Discussions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTopics, setFilteredTopics] = useState<DiscussionTopic[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOwnerOrAdmin, loading: roleLoading } = useUserRole();
  const { topics, loadTopics, loading } = useRealDiscussions();

  // Load topics on component mount
  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  // Filter topics based on search query
  useEffect(() => {
    if (!topics) return;
    
    if (!searchQuery.trim()) {
      setFilteredTopics(topics);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = topics.filter(topic => 
      (topic.title || topic.name || '').toLowerCase().includes(query) || 
      (topic.description || '').toLowerCase().includes(query)
    );
    
    setFilteredTopics(filtered);
  }, [searchQuery, topics]);

  // Handle topic click
  const handleTopicClick = (topicId: string) => {
    navigate(`/discussions/topic/${topicId}`);
  };

  // Apenas owners e admins podem criar tópicos
  const canCreateTopics = isOwnerOrAdmin;

  return (
    <MainLayout title="Discussions">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Discussion Forums</h1>
          <p className="text-muted-foreground mt-1">
            Join the conversation in our community forums
          </p>
        </div>
        
        {canCreateTopics && (
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle size={16} className="mr-2" />
            New Topic
          </Button>
        )}
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <Card 
              key={topic.id} 
              className="cursor-pointer hover:border-purple-300 transition-colors"
              onClick={() => handleTopicClick(topic.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{topic.title || topic.name}</CardTitle>
                    <CardDescription className="mt-1">{topic.description}</CardDescription>
                  </div>
                  {topic.icon && (
                    <div 
                      className="text-white rounded-md p-2 flex items-center justify-center"
                      style={{ 
                        backgroundColor: topic.color || '#6941C6',
                        width: '40px',
                        height: '40px'
                      }}
                    >
                      {(() => {
                        // This would ideally use a dynamic icon component
                        switch (topic.icon) {
                          case 'users':
                            return <Users size={20} />;
                          case 'trending-up':
                            return <TrendingUp size={20} />;
                          default:
                            return <MessageSquare size={20} />;
                        }
                      })()}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm gap-2">
                  <Badge variant="outline" className="text-xs">
                    {topic.discussionCount || 0} Discussions
                  </Badge>
                  
                  {topic.is_featured && (
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200 text-xs">
                      Featured
                    </Badge>
                  )}
                  
                  {topic.is_private && (
                    <Badge variant="outline" className="text-xs">
                      Private
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <div className="flex justify-between items-center w-full">
                  <span className="flex items-center">
                    <Users size={14} className="mr-1" /> {topic.memberCount || 0} members
                  </span>
                  <span>
                    {topic.recentActivity ? (
                      `Updated ${formatDistanceToNow(new Date(topic.recentActivity), { addSuffix: true })}`
                    ) : (
                      `Created ${formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}`
                    )}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-card">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No topics found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? 
              `No topics matching "${searchQuery}"` : 
              "There are no discussion topics yet"
            }
          </p>
          {canCreateTopics && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle size={16} className="mr-2" />
              Create the first topic
            </Button>
          )}
        </div>
      )}
      
      {/* Topic creation dialog */}
      <CreateTopicDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onTopicCreated={loadTopics}
      />
    </MainLayout>
  );
};

export default Discussions;
