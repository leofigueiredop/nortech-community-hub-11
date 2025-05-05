import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/ApiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchIcon, MapPin, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Community } from '@/api/interfaces/ICommunityRepository';

const Step1CommunityContext: React.FC = () => {
  const { communityId } = useParams();
  const { setCommunityContext, updateOnboardingStep } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would fetch communities from API
        // For now, let's use mock data but prepare for API integration
        
        // Placeholder for API call
        // const communities = await api.community.getCommunities();
        // setCommunities(communities);
        
        // Mock data for now
        const mockCommunities = [
          {
            id: 'comm-1',
            name: 'Design Masters',
            description: 'A community for UI/UX designers to share work and get feedback',
            creator_id: 'creator-1',
            logo_url: 'https://placehold.co/150',
            banner_url: 'https://placehold.co/800x200',
            theme_config: { primaryColor: '#7E69AB' },
            status: 'active' as const,
            // Mock additional properties for UI
            memberCount: 1243,
            creatorName: 'Sarah Johnson'
          },
          {
            id: 'comm-2',
            name: 'Web3 Explorers',
            description: 'Exploring the frontiers of blockchain and web3 technology',
            creator_id: 'creator-2',
            logo_url: 'https://placehold.co/150',
            banner_url: 'https://placehold.co/800x200',
            theme_config: { primaryColor: '#3B82F6' },
            status: 'active' as const,
            // Mock additional properties for UI
            memberCount: 876,
            creatorName: 'Michael Chen'
          },
          {
            id: 'comm-3',
            name: 'Creator Economy',
            description: 'For content creators building their business online',
            creator_id: 'creator-3',
            logo_url: 'https://placehold.co/150',
            banner_url: 'https://placehold.co/800x200',
            theme_config: { primaryColor: '#F97316' },
            status: 'active' as const,
            // Mock additional properties for UI
            memberCount: 2156,
            creatorName: 'Alex Rivera'
          }
        ];
        
        setCommunities(mockCommunities as Community[]);
      } catch (error) {
        console.error('Error fetching communities:', error);
        toast({
          title: "Failed to load communities",
          description: "Could not load available communities. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    // If communityId is provided in URL, find that community
    if (communityId) {
      const community = communities.find(c => c.id === communityId);
      if (community) {
        handleSelectCommunity(community);
      } else if (!loading) {
        // If community not found and we're done loading, show search
        setShowSearch(true);
      }
    } else {
      // If no communityId, show search
      setShowSearch(true);
    }
  }, [communityId, communities, loading]);

  const handleSelectCommunity = (community: Community & { creatorName?: string; memberCount?: number }) => {
    // Set community context
    setCommunityContext({
      communityId: community.id,
      communityName: community.name,
      creatorName: community.creatorName || 'Creator', // Fallback
      branding: {
        logo: community.logo_url || '',
        primaryColor: community.theme_config?.primaryColor || '#000000',
        bannerUrl: community.banner_url || ''
      },
      entryType: 'free' // Default to free, can be upgraded later
    });
    
    // Set current community in API client
    api.setCurrentCommunity(community.id);
    
    // Save to localStorage
    localStorage.setItem('nortechCommunityContext', JSON.stringify({
      communityId: community.id,
      communityName: community.name,
      creatorName: community.creatorName || 'Creator'
    }));
    
    // Show toast
    toast({
      title: `Welcome to ${community.name}!`,
      description: `You're about to join ${community.name} by ${community.creatorName || 'Creator'}`,
    });
    
    // Move to next step
    updateOnboardingStep(2);
    navigate('/auth/login');
  };

  const filteredCommunities = searchQuery 
    ? communities.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c as any).creatorName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : communities;

  return (
    <Card className="w-full shadow-lg animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-center mb-2">
          {showSearch ? 'Find Your Community' : 'Joining a Community'}
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          {showSearch 
            ? 'Search for a creator or community to join' 
            : `You're about to join a creator's branded community`}
        </p>
        
        {showSearch && (
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search communities or creators..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <div className="space-y-4 max-h-[320px] overflow-y-auto p-1">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading communities...</p>
            </div>
          ) : filteredCommunities.length > 0 ? (
            filteredCommunities.map(community => (
              <div 
                key={community.id}
                className="flex items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelectCommunity(community as any)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-4">
                  {community.logo_url ? (
                    <img src={community.logo_url} alt={community.name} className="w-full h-full object-cover" />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center font-bold bg-primary text-primary-foreground"
                    >
                      {community.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{community.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="truncate">by {(community as any).creatorName || 'Creator'}</span>
                    <span className="mx-2">•</span>
                    <span>{(community as any).memberCount?.toLocaleString() || '0'} members</span>
                  </div>
                </div>
                <div className="ml-2">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-lg font-medium">No communities found</p>
              <p className="text-sm text-muted-foreground">Try searching with a different term</p>
            </div>
          )}
        </div>
        
        {!showSearch && (
          <Button 
            className="w-full mt-6"
            onClick={() => setShowSearch(true)}
          >
            Search for a different community
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Step1CommunityContext;
