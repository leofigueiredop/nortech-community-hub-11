import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Users, MessageSquare } from 'lucide-react';
import { AIMatchTab } from './tabs/AIMatchTab';
import { NetworkingTab } from './tabs/NetworkingTab';
import { ChatTab } from './tabs/ChatTab';

export const MatchmakerTabs = () => {
  return (
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

      <TabsContent value="ai-match">
        <AIMatchTab />
      </TabsContent>
      
      <TabsContent value="networking">
        <NetworkingTab />
      </TabsContent>
      
      <TabsContent value="chat">
        <ChatTab />
      </TabsContent>
    </Tabs>
  );
}; 