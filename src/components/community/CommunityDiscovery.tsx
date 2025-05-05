import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import { Community } from '@/api/interfaces/ICommunityRepository';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const categories = [
  { name: 'All', icon: '🌐' },
  { name: 'Technology', icon: '💻' },
  { name: 'Design', icon: '🎨' },
  { name: 'Business', icon: '💼' },
  { name: 'Education', icon: '📚' },
  { name: 'Entertainment', icon: '🎮' },
];

export function CommunityDiscovery() {
  const navigate = useNavigate();
  const { community } = useApi();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        setLoading(true);
        const result = await community.searchCommunities(searchTerm, {
          category: activeCategory !== 'All' ? activeCategory : undefined
        });

        if (!result.ok || !result.data) {
          throw new Error(result.error?.message || 'Failed to load communities');
        }

        setCommunities(result.data);
      } catch (error) {
        console.error('Error loading communities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load communities. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadCommunities, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, activeCategory, community]);

  const handleJoinCommunity = async (selectedCommunity: Community) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      const result = await community.joinCommunity(selectedCommunity.id, user.id);
      
      if (!result.ok) {
        throw new Error(result.error?.message || 'Failed to join community');
      }

      toast({
        title: 'Success',
        description: `You've joined ${selectedCommunity.name}!`,
      });

      navigate(`/c/${selectedCommunity.slug}/dashboard`);
    } catch (error) {
      console.error('Error joining community:', error);
      toast({
        title: 'Error',
        description: 'Failed to join community. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Discover Communities</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Find and join communities that match your interests
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Search communities..."
            className="pl-10 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category.name}
              variant={activeCategory === category.name ? "default" : "outline"}
              className={`px-4 py-2 text-sm cursor-pointer ${
                activeCategory === category.name ? 'bg-primary' : 'hover:bg-muted'
              }`}
              onClick={() => setActiveCategory(category.name)}
            >
              {category.icon} {category.name}
            </Badge>
          ))}
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600">Loading communities...</p>
            </div>
          ) : communities.length > 0 ? (
            communities.map((community) => (
              <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  {community.banner_url ? (
                    <img
                      src={community.banner_url}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <span className="text-4xl">{community.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {community.logo_url ? (
                        <img
                          src={community.logo_url}
                          alt={`${community.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-bold">
                          {community.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{community.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {community.creator_name || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {community.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {community.member_count?.toLocaleString() || '0'} members
                    </span>
                    <Button
                      onClick={() => handleJoinCommunity(community)}
                      className="ml-auto"
                    >
                      Join <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2">No communities found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 