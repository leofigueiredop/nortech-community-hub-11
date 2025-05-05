import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock data para networking - em um cenário real, estes viriam do Supabase
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

export const NetworkingTab = () => {
  const { user } = useAuth();
  
  return (
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
  );
}; 