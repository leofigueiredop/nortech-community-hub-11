import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, ArrowRight } from 'lucide-react';

// Mock data for initial match suggestion
const mockNetworkingMembers = [
  { 
    id: 1, 
    name: 'David Wilson', 
    interests: ['Web3', 'Smart Contracts', 'DeFi'], 
    experience: 'Senior Developer',
    image: '/placeholder.svg' 
  },
  { 
    id: 2, 
    name: 'Emma Rodriguez', 
    interests: ['Blockchain Security', 'Auditing', 'Zero Knowledge'], 
    experience: 'Security Consultant',
    image: '/placeholder.svg' 
  },
  { 
    id: 3, 
    name: 'Michael Chang', 
    interests: ['NFTs', 'Gaming', 'Metaverse'], 
    experience: 'Product Manager',
    image: '/placeholder.svg' 
  },
  { 
    id: 4, 
    name: 'Sophia Park', 
    interests: ['DAOs', 'Governance', 'Community Building'], 
    experience: 'Community Lead',
    image: '/placeholder.svg' 
  },
];

export const AIMatchTab = () => {
  const [matchSuggestion, setMatchSuggestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulação de busca de match - em um cenário real, usaríamos o Supabase aqui
  const handleGetAIMatch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockNetworkingMembers.length);
      setMatchSuggestion(mockNetworkingMembers[randomIndex]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Match Suggestions</CardTitle>
          <CardDescription>
            Our AI will suggest members who share your interests and goals, creating meaningful networking opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!matchSuggestion ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Sparkles className="h-16 w-16 text-indigo-600" />
              <h3 className="text-xl font-medium text-center">Find Your Next Connection</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                Let our AI matchmaker find someone in the community who shares your interests and could be a great connection!
              </p>
              <Button 
                onClick={handleGetAIMatch} 
                disabled={isLoading}
                className="mt-2 bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? 'Finding Match...' : 'Get AI Match'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start p-6 border rounded-lg">
              <Avatar className="h-24 w-24">
                <AvatarImage src={matchSuggestion.image} alt={matchSuggestion.name} />
                <AvatarFallback>{matchSuggestion.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-medium">{matchSuggestion.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{matchSuggestion.experience}</p>
                
                <div className="mt-3">
                  <p className="font-medium mb-2">Shared Interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {matchSuggestion.interests.map((interest: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Start Conversation
                  </Button>
                  <Button variant="outline" onClick={() => setMatchSuggestion(null)}>
                    Find Another Match
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Why We Matched You</CardTitle>
          <CardDescription>
            Our AI analyzes profiles, completed content, and interaction patterns to suggest meaningful connections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {matchSuggestion ? (
            <>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                <p className="text-indigo-800 dark:text-indigo-200">
                  You and {matchSuggestion.name} share {matchSuggestion.interests.length} common interests and have complementary expertise. Based on your activity patterns, you both engage with similar content and could benefit from connecting.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Recommended conversation starters:</h4>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Ask about their experience in {matchSuggestion.interests[0]}</li>
                  <li>Share your thoughts on recent developments in {matchSuggestion.interests[1]}</li>
                  <li>Discuss potential collaboration opportunities in {matchSuggestion.interests[2]}</li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-4 text-center">
              Get an AI match to see why we think you should connect!
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}; 