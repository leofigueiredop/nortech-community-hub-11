import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock data - em um cenário real, estes viriam do Supabase
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

// Initial messages
const initialMessages: Record<number, Message[]> = {
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
};

export const ChatTab = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Record<number, Message[]>>(initialMessages);

  // Em um cenário real, integraríamos com o Supabase Realtime para as mensagens
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
    
    // Em um cenário real: await supabase.from('messages').insert({...})
    
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
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Your Conversations</CardTitle>
        <CardDescription>
          Connect with community members through real-time messaging.
        </CardDescription>
      </CardHeader>
      <div className="grid md:grid-cols-[300px_1fr] border-t">
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
        
        <div className="flex flex-col h-[600px]">
          {activeChat ? (
            <>
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
  );
}; 