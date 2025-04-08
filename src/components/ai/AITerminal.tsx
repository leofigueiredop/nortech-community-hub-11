
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send, X, Minimize, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface Message {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AITerminalProps {
  terminalName?: string;
  onClose?: () => void;
  onMinimize?: () => void;
}

const AITerminal: React.FC<AITerminalProps> = ({ 
  terminalName = "Nortech AI",
  onClose,
  onMinimize
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: `Hello! I'm ${terminalName}. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (input.trim() === '') return;

    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (would connect to actual AI in production)
    setTimeout(() => {
      let response: Message;

      // Simple response logic based on keywords (just for demo)
      if (input.toLowerCase().includes('event') || input.toLowerCase().includes('next')) {
        response = {
          content: "The next community event is 'Web3 Workshop' on April 15th at 6:00 PM. Would you like me to send you the calendar invite?",
          sender: 'ai',
          timestamp: new Date()
        };
      } else if (input.toLowerCase().includes('course') || input.toLowerCase().includes('certificate')) {
        response = {
          content: "To get the Web3 certificate, you need to complete all 5 modules in the Web3 Fundamentals course and pass the final assessment with a score of at least 85%.",
          sender: 'ai',
          timestamp: new Date()
        };
      } else if (input.toLowerCase().includes('post') || input.toLowerCase().includes('liked')) {
        response = {
          content: "The most liked post this month is by Sarah Chen titled '10 Smart Contract Security Tips Every Developer Should Know' with 87 likes and 32 comments.",
          sender: 'ai',
          timestamp: new Date()
        };
      } else {
        response = {
          content: "I'm here to help with information about community events, courses, resources, and members. What specific information are you looking for?",
          sender: 'ai',
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className={`border shadow-md transition-all duration-300 ${
      isExpanded ? 'h-[600px] w-full max-w-3xl' : 'h-[450px] w-full max-w-md'
    }`}>
      <CardHeader className="bg-indigo-600 text-white py-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-5 w-5" />
          <h3 className="font-semibold">{terminalName}</h3>
        </div>
        <div className="flex items-center gap-1">
          {onMinimize && (
            <Button variant="ghost" size="icon" onClick={onMinimize} className="h-7 w-7 text-white hover:text-white hover:bg-indigo-700">
              <Minimize className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggleExpand} className="h-7 w-7 text-white hover:text-white hover:bg-indigo-700">
            {isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-white hover:text-white hover:bg-indigo-700">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="h-[calc(100%-56px)] overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] px-4 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 shadow-sm border rounded-tl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 shadow-sm border rounded-lg rounded-tl-none max-w-[85%] px-4 py-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-white dark:bg-slate-950 p-3">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about events, courses, members..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AITerminal;
