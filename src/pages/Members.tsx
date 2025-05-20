import React, { useState, useEffect } from 'react';
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
import { useRealMembers, ExtendedMember } from '@/hooks/useRealMembers';
import { CommunityMember } from '@/types/community';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

// Define member plan type
type MemberPlan = 'Premium' | 'Free' | 'Pro';

// Helper function to determine member plan
const getMemberPlan = (member: CommunityMember): MemberPlan => {
  // In a real implementation, this would be based on subscription data
  // For now, we'll use a simple heuristic based on role
  return member.role === 'admin' || member.role === 'owner' ? 'Premium' : 'Free';
};

const getPlanColor = (plan: MemberPlan) => {
  switch (plan) {
    case 'Premium':
      return 'bg-nortech-purple text-white';
    case 'Pro':
      return 'bg-blue-600 text-white';
    default:
      return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'owner':
    case 'admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'moderator':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

// Format role for display
const formatRole = (role: string): string => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

interface MemberCardProps {
  member: ExtendedMember;
  onUpdateRole: (userId: string, role: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onUpdateRole }) => {
  const plan = getMemberPlan(member);
  const displayRole = formatRole(member.role);
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.profile?.avatar_url || ''} alt={member.profile?.name || 'Member'} />
            <AvatarFallback>{member.profile?.name?.charAt(0) || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {member.profile?.name || 'Unknown Member'}
              <Badge className={getRoleColor(member.role)} variant="outline">
                {displayRole}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              {member.profile?.email} • Joined {new Date(member.joined_at).toLocaleDateString()}
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getPlanColor(plan)}>
            {plan}
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
              {member.role !== 'owner' && (
                <>
                  <DropdownMenuItem 
                    className="flex items-center gap-2"
                    onClick={() => onUpdateRole(member.user_id, 'admin')}
                    disabled={member.role === 'admin'}
                  >
                    <Shield size={14} />
                    <span>Make Admin</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2"
                    onClick={() => onUpdateRole(member.user_id, 'moderator')}
                    disabled={member.role === 'moderator'}
                  >
                    <Shield size={14} />
                    <span>Make Moderator</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2"
                    onClick={() => onUpdateRole(member.user_id, 'member')}
                    disabled={member.role === 'member'}
                  >
                    <Shield size={14} />
                    <span>Make Member</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Email</span>
            <span>{member.profile?.email}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500">Last active</span>
            <span>{member.lastActive || 'Unknown'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Members = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const { loading, members, totalMembers, newMembersCount, loadAllMembers, loadCounts, updateMemberRole, inviteMember } = useRealMembers();
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    loadAllMembers();
    loadCounts();
  }, [loadAllMembers, loadCounts]);
  
  const handleInviteMember = () => {
    // In a real app, this would open a modal or form
    const email = prompt('Enter email address to invite:');
    if (email) {
      inviteMember(email);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const success = await updateMemberRole(userId, newRole);
    if (success) {
      // Role updated successfully, no need to do anything as the UI is updated in the hook
    }
  };

  // Filter members based on current tab and search query
  const getFilteredMembers = () => {
    let filtered = [...members];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(member => 
        member.profile?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        member.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by tab
    switch (currentTab) {
      case 'premium':
        filtered = filtered.filter(member => getMemberPlan(member) === 'Premium');
        break;
      case 'free':
        filtered = filtered.filter(member => getMemberPlan(member) === 'Free');
        break;
      case 'admins':
        filtered = filtered.filter(member => 
          member.role === 'admin' || 
          member.role === 'owner' || 
          member.role === 'moderator'
        );
        break;
      // default (all): no additional filtering
    }
    
    return filtered;
  };

  const filteredMembers = getFilteredMembers();
  const premiumCount = members.filter(m => getMemberPlan(m) === 'Premium').length;

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
          <Tabs 
            defaultValue="all" 
            className="w-full"
            value={currentTab}
            onValueChange={setCurrentTab}
          >
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
                    <h3 className="text-3xl font-bold">{totalMembers}</h3>
                    <p className="text-gray-500 text-sm">Total Members</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">{premiumCount}</h3>
                    <p className="text-gray-500 text-sm">Premium Members</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">{newMembersCount}</h3>
                    <p className="text-gray-500 text-sm">New This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="spinner animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  {filteredMembers.map(member => (
                    <MemberCard 
                      key={member.id} 
                      member={member} 
                      onUpdateRole={handleUpdateRole}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="premium">
                  {filteredMembers.map(member => (
                    <MemberCard 
                      key={member.id} 
                      member={member} 
                      onUpdateRole={handleUpdateRole}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="free">
                  {filteredMembers.map(member => (
                    <MemberCard 
                      key={member.id} 
                      member={member} 
                      onUpdateRole={handleUpdateRole}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="admins">
                  {filteredMembers.map(member => (
                    <MemberCard 
                      key={member.id} 
                      member={member} 
                      onUpdateRole={handleUpdateRole}
                    />
                  ))}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Members;
