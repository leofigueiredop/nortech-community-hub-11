
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchIcon, MapPin, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock communities data
const MOCK_COMMUNITIES = [
  {
    id: 'comm-1',
    name: 'Design Masters',
    creatorName: 'Sarah Johnson',
    logo: 'https://via.placeholder.com/150',
    bannerUrl: 'https://via.placeholder.com/800x200',
    primaryColor: '#7E69AB',
    description: 'A community for UI/UX designers to share work and get feedback',
    memberCount: 1243
  },
  {
    id: 'comm-2',
    name: 'Web3 Explorers',
    creatorName: 'Michael Chen',
    logo: 'https://via.placeholder.com/150',
    bannerUrl: 'https://via.placeholder.com/800x200',
    primaryColor: '#3B82F6',
    description: 'Exploring the frontiers of blockchain and web3 technology',
    memberCount: 876
  },
  {
    id: 'comm-3',
    name: 'Creator Economy',
    creatorName: 'Alex Rivera',
    logo: 'https://via.placeholder.com/150',
    bannerUrl: 'https://via.placeholder.com/800x200',
    primaryColor: '#F97316',
    description: 'For content creators building their business online',
    memberCount: 2156
  }
];

const Step1CommunityContext: React.FC = () => {
  const { communityId } = useParams();
  const { setCommunityContext, updateOnboardingStep } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    // If communityId is provided in URL, find that community
    if (communityId) {
      const community = MOCK_COMMUNITIES.find(c => c.id === communityId);
      if (community) {
        handleSelectCommunity(community);
      } else {
        // If community not found, show search
        setShowSearch(true);
      }
    } else {
      // If no communityId, show search
      setShowSearch(true);
    }
  }, [communityId]);

  const handleSelectCommunity = (community: any) => {
    // Set community context
    setCommunityContext({
      communityId: community.id,
      communityName: community.name,
      creatorName: community.creatorName,
      branding: {
        logo: community.logo,
        primaryColor: community.primaryColor,
        bannerUrl: community.bannerUrl
      },
      entryType: 'free' // Default to free, can be upgraded later
    });
    
    // Save to localStorage
    localStorage.setItem('nortechCommunityContext', JSON.stringify({
      communityId: community.id,
      communityName: community.name,
      creatorName: community.creatorName
    }));
    
    // Show toast
    toast({
      title: `Welcome to ${community.name}!`,
      description: `You're about to join ${community.name} by ${community.creatorName}`,
    });
    
    // Move to next step
    updateOnboardingStep(2);
    navigate('/auth/login');
  };

  const filteredCommunities = searchQuery 
    ? MOCK_COMMUNITIES.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.creatorName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MOCK_COMMUNITIES;

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
          {filteredCommunities.map(community => (
            <div 
              key={community.id}
              className="flex items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleSelectCommunity(community)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-4">
                {community.logo ? (
                  <img src={community.logo} alt={community.name} className="w-full h-full object-cover" />
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
                  <span className="truncate">by {community.creatorName}</span>
                  <span className="mx-2">•</span>
                  <span>{community.memberCount.toLocaleString()} members</span>
                </div>
              </div>
              <div className="ml-2">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
          
          {searchQuery && filteredCommunities.length === 0 && (
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
