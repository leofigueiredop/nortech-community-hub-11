import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Search, Filter, MoreHorizontal, UserPlus, Shield, Trash2, User, AlertCircle, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CommunityMember {
  id: string;
  user_id: string;
  community_id: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  created_at: string;
  user: {
    id: string;
    email: string;
    profile: {
      id: string;
      full_name: string;
      avatar_url: string | null;
    }
  }
  moderator_permissions?: {
    can_delete_content: boolean;
    can_ban_users: boolean;
    can_edit_user_content: boolean;
    can_approve_flagged_content: boolean;
  } | null;
}

const UserManagement: React.FC = () => {
  const { user, community } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [error, setError] = useState<string | null>(null);
  
  // Role permissions
  const effectiveRole = user?.communityRole || user?.role || 'member';
  const isOwner = effectiveRole === 'owner';
  const isAdmin = effectiveRole === 'owner' || effectiveRole === 'admin';
  const isModerator = effectiveRole === 'moderator' || isAdmin;
  const canManageUsers = isAdmin || (isModerator && user?.moderatorPermissions?.can_ban_users);
  
  // Fetch community members
  useEffect(() => {
    if (community?.id) {
      fetchMembers();
    }
  }, [community]);
  
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          id,
          user_id,
          community_id,
          role,
          created_at,
          moderator_permissions,
          user:user_id (
            id,
            email,
            profile:profiles (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('community_id', community!.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setMembers(data as CommunityMember[]);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      setError(error.message || 'Failed to load community members.');
      toast({
        title: 'Error loading members',
        description: error.message || 'Failed to load community members.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateRole = async () => {
    if (!selectedMember || !selectedRole) return;
    
    // Prevent non-owners from changing owner role
    if ((selectedRole === 'owner' || selectedMember.role === 'owner') && !isOwner) {
      toast({
        title: 'Permission denied',
        description: 'Only the community owner can assign or change the owner role.',
        variant: 'destructive',
      });
      return;
    }
    
    // Prevent changing your own role
    if (selectedMember.user_id === user?.id) {
      toast({
        title: 'Permission denied',
        description: 'You cannot change your own role.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsActionInProgress(true);
    
    try {
      const { error } = await supabase
        .from('community_members')
        .update({ 
          role: selectedRole,
          // Reset moderator permissions when changing roles
          moderator_permissions: selectedRole === 'moderator' ? {
            can_delete_content: false,
            can_ban_users: false,
            can_edit_user_content: false,
            can_approve_flagged_content: false
          } : null
        })
        .eq('id', selectedMember.id);
        
      if (error) throw error;
      
      // Update the member in local state
      setMembers(members.map(member => 
        member.id === selectedMember.id 
          ? { ...member, role: selectedRole as any } 
          : member
      ));
      
      toast({
        title: 'Role updated',
        description: `${selectedMember.user.profile.full_name}'s role was updated to ${selectedRole}.`,
      });
      
      setIsRoleDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error updating role',
        description: error.message || 'Failed to update member role.',
        variant: 'destructive',
      });
    } finally {
      setIsActionInProgress(false);
    }
  };
  
  const handleRemoveMember = async (member: CommunityMember) => {
    // Prevent removing yourself
    if (member.user_id === user?.id) {
      toast({
        title: 'Permission denied',
        description: 'You cannot remove yourself from the community.',
        variant: 'destructive',
      });
      return;
    }
    
    // Prevent non-owners from removing owners
    if (member.role === 'owner' && !isOwner) {
      toast({
        title: 'Permission denied',
        description: 'Only the community owner can remove other owners.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsActionInProgress(true);
    
    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('id', member.id);
        
      if (error) throw error;
      
      // Remove the member from local state
      setMembers(members.filter(m => m.id !== member.id));
      
      toast({
        title: 'Member removed',
        description: `${member.user.profile.full_name} was removed from the community.`,
      });
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error removing member',
        description: error.message || 'Failed to remove member from community.',
        variant: 'destructive',
      });
    } finally {
      setIsActionInProgress(false);
    }
  };
  
  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) {
      setError('Please enter an email address.');
      return;
    }
    
    setIsActionInProgress(true);
    setError(null);
    
    try {
      // In a real implementation, this would send an invitation email
      // For now, we'll just show a success message
      toast({
        title: 'Invitation sent',
        description: `An invitation was sent to ${inviteEmail}.`,
      });
      
      setInviteEmail('');
      setInviteRole('member');
      setIsInviteDialogOpen(false);
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      setError(error.message || 'Failed to send invitation.');
    } finally {
      setIsActionInProgress(false);
    }
  };
  
  // Filter and search members
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.user.profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // If not authorized to manage users, show restricted message
  if (!canManageUsers) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage community members and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                You need appropriate permissions to manage community users.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage community members and their roles
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Community Members</CardTitle>
              <CardDescription>
                {members.length} {members.length === 1 ? 'member' : 'members'} in your community
              </CardDescription>
            </div>
            
            <Button 
              onClick={() => setIsInviteDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="owner">Owners</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                    <SelectItem value="moderator">Moderators</SelectItem>
                    <SelectItem value="member">Regular Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery || roleFilter !== 'all' 
                  ? "No members match your filters"
                  : "No members found in your community"
                }
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {member.user.profile.avatar_url ? (
                                <img 
                                  src={member.user.profile.avatar_url} 
                                  alt={member.user.profile.full_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                            <span>{member.user.profile.full_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{member.user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              member.role === 'owner' ? 'default' : 
                              member.role === 'admin' ? 'secondary' : 
                              member.role === 'moderator' ? 'outline' : 'secondary'
                            }
                            className={
                              member.role === 'owner' ? 'bg-red-500' : 
                              member.role === 'admin' ? 'bg-blue-500' : 
                              member.role === 'moderator' ? 'border-yellow-500 text-yellow-500' : 'bg-gray-500'
                            }
                          >
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(member.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMember(member);
                                  setSelectedRole(member.role);
                                  setIsRoleDialogOpen(true);
                                }}
                                className="cursor-pointer"
                                disabled={member.user_id === user?.id}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleRemoveMember(member)}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                disabled={member.user_id === user?.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Role Change Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Update role for {selectedMember?.user.profile.full_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {isOwner && <SelectItem value="owner">Owner</SelectItem>}
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="member">Regular Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Role Permissions:</h4>
              <div className="text-sm text-muted-foreground">
                {selectedRole === 'owner' && (
                  <p>Owners have full control over all community settings and members.</p>
                )}
                {selectedRole === 'admin' && (
                  <p>Administrators can manage most community settings and members.</p>
                )}
                {selectedRole === 'moderator' && (
                  <p>Moderators can help manage content and members based on specific permissions.</p>
                )}
                {selectedRole === 'member' && (
                  <p>Regular members can participate in the community but cannot change settings.</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRoleDialogOpen(false)}
              disabled={isActionInProgress}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateRole}
              disabled={isActionInProgress}
            >
              {isActionInProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {isOwner && <SelectItem value="owner">Owner</SelectItem>}
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="member">Regular Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsInviteDialogOpen(false)}
              disabled={isActionInProgress}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendInvite}
              disabled={isActionInProgress}
            >
              {isActionInProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement; 