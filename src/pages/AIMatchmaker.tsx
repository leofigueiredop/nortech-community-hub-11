
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AITerminal from '@/components/ai/AITerminal';

const mockChatHistory = [
  { id: 1, name: 'Sarah Chen', lastMessage: 'Thanks for the smart contract tips!', date: '2 days ago', image: '/placeholder.svg' },
  { id: 2, name: 'Mark Johnson', lastMessage: 'Are you going to the Web3 workshop?', date: '3 days ago', image: '/placeholder.svg' },
  { id: 3, name: 'Priya Sharma', lastMessage: "I'd love to collaborate on the project", date: '1 week ago', image: '/placeholder.svg' },
];

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

const AIMatchmaker: React.FC = () => {
  const [matchSuggestion, setMatchSuggestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAIMatch = () => {
    setIsLoading(true);
    // Simulate API call to get AI match suggestion
    setTimeout(() => {
      // Random selection from the networking members for demo purposes
      const randomIndex = Math.floor(Math.random() * mockNetworkingMembers.length);
      setMatchSuggestion(mockNetworkingMembers[randomIndex]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <MainLayout title="AI Matchmaker">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-semibold">AI Matchmaker</h1>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-3xl">
          Connect with other community members based on shared interests, goals, and activities. 
          Our AI analyzes profiles and interactions to suggest meaningful connections.
        </p>

        <Tabs defaultValue="ai-match" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="ai-match">
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span>AI Match</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="networking">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Open to Networking</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="chat-history">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Chat History</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-match" className="space-y-6">
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
            
            <Card>
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
          </TabsContent>

          <TabsContent value="networking">
            <Card>
              <CardHeader>
                <CardTitle>Members Open to Networking</CardTitle>
                <CardDescription>
                  These community members have indicated they're open to new connections and collaborations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockNetworkingMembers.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4 flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.image} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.experience}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {member.interests.map((interest, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs rounded-full"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="mt-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950 p-0 h-auto"
                        >
                          <span>Connect</span>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat-history">
            <Card>
              <CardHeader>
                <CardTitle>Your Conversations</CardTitle>
                <CardDescription>
                  Previous conversations with community members you've connected with.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Last Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockChatHistory.map((chat) => (
                      <TableRow key={chat.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={chat.image} />
                            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {chat.name}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{chat.lastMessage}</TableCell>
                        <TableCell>{chat.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Continue
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AIMatchmaker;
