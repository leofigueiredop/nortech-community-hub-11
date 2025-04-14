
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, Users, Sparkles, ArrowRight, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

// Mock data for networking members
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

// Mock data for chat contacts
const mockChatContacts = [
  { id: 1, name: 'Sarah Chen', image: '/placeholder.svg', online: true },
  { id: 2, name: 'Mark Johnson', image: '/placeholder.svg', online: false },
  { id: 3, name: 'Priya Sharma', image: '/placeholder.svg', online: true },
];

// Message type definition
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'contact';
  timestamp: string;
}

const AIMatchmaker: React.FC = () => {
  const [matchSuggestion, setMatchSuggestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, text: "Hi there! Thanks for reaching out about smart contracts.", sender: 'contact', timestamp: '10:30 AM' },
      { id: 2, text: "Could you share more details about your project?", sender: 'contact', timestamp: '10:31 AM' },
      { id: 3, text: "I'm working on a DeFi protocol and need some security advice.", sender: 'user', timestamp: '10:33 AM' },
    ],
    2: [
      { id: 1, text: "Are you going to the Web3 workshop next week?", sender: 'user', timestamp: 'Yesterday' },
      { id: 2, text: "Yes, I've already registered. Looking forward to it!", sender: 'contact', timestamp: 'Yesterday' },
    ],
    3: [
      { id: 1, text: "I'd love to collaborate on the project", sender: 'contact', timestamp: '2 days ago' },
      { id: 2, text: "That sounds great! Let's schedule a call to discuss details.", sender: 'user', timestamp: '2 days ago' },
    ],
  });

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

  const handleSendMessage = () => {
    if (!messageInput.trim() || activeChat === null) return;
    
    const newMessage = {
      id: (messages[activeChat]?.length || 0) + 1,
      text: messageInput,
      sender: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));
    
    setMessageInput('');
    
    // Simulate reply after a short delay
    setTimeout(() => {
      const reply = {
        id: (messages[activeChat]?.length || 0) + 2,
        text: `Thanks for your message! This is an automated reply for demonstration purposes.`,
        sender: 'contact' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), reply]
      }));
    }, 1000);
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
            <TabsTrigger value="chat">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Chat</span>
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

          <TabsContent value="chat">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Your Conversations</CardTitle>
                <CardDescription>
                  Connect with community members through real-time messaging.
                </CardDescription>
              </CardHeader>
              <div className="grid md:grid-cols-[300px_1fr] border-t">
                {/* Contacts List */}
                <div className="border-r max-h-[600px] overflow-y-auto">
                  <div className="p-3 border-b">
                    <Input 
                      placeholder="Search conversations..." 
                      className="w-full"
                    />
                  </div>
                  <div className="divide-y">
                    {mockChatContacts.map(contact => (
                      <div 
                        key={contact.id} 
                        className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 ${
                          activeChat === contact.id ? 'bg-indigo-50 dark:bg-indigo-950' : ''
                        }`}
                        onClick={() => setActiveChat(contact.id)}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.image} />
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{contact.name}</p>
                          {messages[contact.id] && messages[contact.id].length > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {messages[contact.id][messages[contact.id].length - 1].text}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Chat Area */}
                <div className="flex flex-col h-[600px]">
                  {activeChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={mockChatContacts.find(c => c.id === activeChat)?.image} />
                          <AvatarFallback>
                            {mockChatContacts.find(c => c.id === activeChat)?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {mockChatContacts.find(c => c.id === activeChat)?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {mockChatContacts.find(c => c.id === activeChat)?.online 
                              ? 'Online' 
                              : 'Offline'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages[activeChat]?.map(message => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[85%] px-4 py-2 rounded-lg ${
                                message.sender === 'user' 
                                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                                  : 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Message Input */}
                      <div className="p-4 border-t">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Type a message..." 
                            className="flex-1"
                            value={messageInput}
                            onChange={e => setMessageInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button 
                            className="bg-indigo-600 hover:bg-indigo-700"
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                      <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                      <h3 className="text-xl font-medium text-center">Select a conversation</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-md">
                        Choose a contact from the left to start messaging
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AIMatchmaker;
