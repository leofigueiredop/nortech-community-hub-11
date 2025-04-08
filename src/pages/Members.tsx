
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, MoreHorizontal, Mail, UserPlus, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const MEMBERS = [
  {
    id: 1,
    name: "Emma Wilson",
    username: "@emmawilson",
    avatar: "/placeholder.svg",
    joinDate: "March 15, 2025",
    plan: "Premium",
    role: "Admin",
    lastActive: "2 hours ago",
    email: "emma.wilson@example.com"
  },
  {
    id: 2,
    name: "Marcus Chen",
    username: "@marcuschen",
    avatar: "/placeholder.svg",
    joinDate: "March 18, 2025",
    plan: "Premium",
    role: "Member",
    lastActive: "5 hours ago",
    email: "marcus.chen@example.com"
  },
  {
    id: 3,
    name: "Alex Johnson",
    username: "@alexj",
    avatar: "/placeholder.svg",
    joinDate: "March 20, 2025",
    plan: "Free",
    role: "Member",
    lastActive: "1 day ago",
    email: "alex.johnson@example.com"
  },
  {
    id: 4,
    name: "Sophie Taylor",
    username: "@sophiet",
    avatar: "/placeholder.svg",
    joinDate: "March 25, 2025",
    plan: "Free",
    role: "Member",
    lastActive: "3 days ago",
    email: "sophie.taylor@example.com"
  },
  {
    id: 5,
    name: "Michael Brown",
    username: "@michaelb",
    avatar: "/placeholder.svg",
    joinDate: "April 1, 2025",
    plan: "Premium",
    role: "Moderator",
    lastActive: "6 hours ago",
    email: "michael.brown@example.com"
  },
];

const getPlanColor = (plan) => {
  switch (plan) {
    case 'Premium':
      return 'bg-nortech-purple text-white';
    case 'Pro':
      return 'bg-blue-600 text-white';
    default:
      return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case 'Admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'Moderator':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const MemberCard = ({ member }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {member.name}
              <Badge className={getRoleColor(member.role)} variant="outline">
                {member.role}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              {member.username} • Joined {member.joinDate}
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getPlanColor(member.plan)}>
            {member.plan}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Mail size={14} />
                <span>Message</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Shield size={14} />
                <span>Change Role</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Email</span>
            <span>{member.email}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500">Last active</span>
            <span>{member.lastActive}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Members = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleInviteMember = () => {
    // Implementation would go here
  };

  return (
    <MainLayout title="Members">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Members</h1>
          <Button 
            onClick={handleInviteMember}
            className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
          >
            <UserPlus size={16} />
            <span>Invite Member</span>
          </Button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input 
                placeholder="Search members..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Members</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
              <TabsTrigger value="admins">Admins & Mods</TabsTrigger>
            </TabsList>
            
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <h3 className="text-3xl font-bold">{MEMBERS.length}</h3>
                    <p className="text-gray-500 text-sm">Total Members</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">{MEMBERS.filter(m => m.plan === 'Premium').length}</h3>
                    <p className="text-gray-500 text-sm">Premium Members</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">3</h3>
                    <p className="text-gray-500 text-sm">New This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <TabsContent value="all">
              {MEMBERS.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </TabsContent>
            
            <TabsContent value="premium">
              {MEMBERS.filter(member => member.plan === 'Premium').map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </TabsContent>
            
            <TabsContent value="free">
              {MEMBERS.filter(member => member.plan === 'Free').map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </TabsContent>
            
            <TabsContent value="admins">
              {MEMBERS.filter(member => ['Admin', 'Moderator'].includes(member.role)).map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Members;
