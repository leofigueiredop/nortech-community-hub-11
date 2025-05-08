import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  AlertCircle, 
  Shield, 
  Loader2, 
  Save, 
  UserPlus, 
  Users, 
  Settings, 
  MessageSquare, 
  FileText, 
  Info, 
  CheckCircle2 
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface RolePermissions {
  can_delete_content: boolean;
  can_ban_users: boolean;
  can_edit_user_content: boolean;
  can_approve_flagged_content: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  is_system_role: boolean;
  permissions: RolePermissions;
}

const defaultRoles: Role[] = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Full control over all community settings and members',
    is_system_role: true,
    permissions: {
      can_delete_content: true,
      can_ban_users: true,
      can_edit_user_content: true,
      can_approve_flagged_content: true
    }
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Manage most community settings and members',
    is_system_role: true,
    permissions: {
      can_delete_content: true,
      can_ban_users: true,
      can_edit_user_content: true,
      can_approve_flagged_content: true
    }
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'Help manage content and members based on specific permissions',
    is_system_role: true,
    permissions: {
      can_delete_content: true,
      can_ban_users: false,
      can_edit_user_content: true,
      can_approve_flagged_content: true
    }
  },
  {
    id: 'member',
    name: 'Member',
    description: 'Regular community member with no additional permissions',
    is_system_role: true,
    permissions: {
      can_delete_content: false,
      can_ban_users: false,
      can_edit_user_content: false,
      can_approve_flagged_content: false
    }
  }
];

const RoleManagement: React.FC = () => {
  const { user, community } = useAuth();
  const { toast } = useToast();
  
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState<RolePermissions>({
    can_delete_content: false,
    can_ban_users: false,
    can_edit_user_content: false,
    can_approve_flagged_content: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // Role permissions
  const effectiveRole = user?.communityRole || user?.role || 'member';
  const isOwner = effectiveRole === 'owner';
  const isAdmin = effectiveRole === 'owner' || effectiveRole === 'admin';
  
  // Load roles
  useEffect(() => {
    if (community?.id) {
      fetchRoles();
    }
  }, [community]);
  
  const fetchRoles = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, we would fetch custom roles from Supabase
      // For now, we'll just use the default roles
      
      // Example implementation of fetching from Supabase:
      /*
      const { data, error } = await supabase
        .from('community_roles')
        .select('*')
        .eq('community_id', community!.id);
        
      if (error) throw error;
      
      // Combine system roles with custom roles
      const customRoles = data || [];
      setRoles([...defaultRoles, ...customRoles]);
      */
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      setError(error.message || 'Failed to load roles.');
      setLoading(false);
    }
  };
  
  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setEditedPermissions(role.permissions);
  };
  
  const handleTogglePermission = (permission: keyof RolePermissions) => {
    setEditedPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };
  
  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    
    // System roles have limitations on what can be changed
    if (selectedRole.is_system_role) {
      if (selectedRole.id === 'owner' || selectedRole.id === 'admin') {
        toast({
          title: 'Cannot modify system role',
          description: 'Owner and Admin permissions cannot be modified.',
          variant: 'destructive',
        });
        return;
      }
      
      // Only moderator permissions can be changed
      if (selectedRole.id !== 'moderator') {
        toast({
          title: 'Cannot modify system role',
          description: 'This system role cannot be modified.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Update locally for demo purposes
      const updatedRoles = roles.map(role => 
        role.id === selectedRole.id 
          ? { ...role, permissions: editedPermissions } 
          : role
      );
      
      setRoles(updatedRoles);
      
      // In production, we would save to Supabase
      // For moderator roles, we would update the default permissions for new moderators
      /*
      if (selectedRole.id === 'moderator') {
        const { error } = await supabase
          .from('community_settings')
          .update({ 
            default_moderator_permissions: editedPermissions 
          })
          .eq('community_id', community!.id);
          
        if (error) throw error;
      } else {
        // For custom roles
        const { error } = await supabase
          .from('community_roles')
          .update({ permissions: editedPermissions })
          .eq('id', selectedRole.id);
          
        if (error) throw error;
      }
      */
      
      toast({
        title: 'Permissions updated',
        description: `Permissions for ${selectedRole.name} role have been updated.`,
      });
      
      setIsEditingRole(false);
    } catch (error: any) {
      console.error('Error updating permissions:', error);
      toast({
        title: 'Error updating permissions',
        description: error.message || 'Failed to update role permissions.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle applying role changes to existing users
  const handleApplyRoleChanges = () => {
    if (!selectedRole) return;
    
    setIsConfirmDialogOpen(true);
  };
  
  const confirmApplyRoleChanges = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    
    try {
      // In production, this would update all users with the selected role
      // For now, we'll just show a success message
      
      toast({
        title: 'Changes applied to users',
        description: `Updated permissions have been applied to all users with the ${selectedRole.name} role.`,
      });
      
      setIsConfirmDialogOpen(false);
    } catch (error: any) {
      console.error('Error applying role changes:', error);
      toast({
        title: 'Error applying changes',
        description: error.message || 'Failed to apply role changes to users.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // If not admin or owner, show restricted message
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Management</CardTitle>
            <CardDescription>
              Configure roles and permissions for community members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                You need to be an owner or administrator to manage roles.
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
        <h1 className="text-2xl font-bold">Role Management</h1>
        <p className="text-muted-foreground">
          Configure roles and permissions for your community
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid md:grid-cols-5 gap-6">
        {/* Roles List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Available Roles</CardTitle>
            <CardDescription>
              Select a role to view or edit its permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    selectedRole?.id === role.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => handleSelectRole(role)}
                >
                  <div className="flex items-center gap-2">
                    <Shield className={`h-5 w-5 ${role.id === 'owner' ? 'text-red-500' : role.id === 'admin' ? 'text-blue-500' : role.id === 'moderator' ? 'text-yellow-500' : 'text-gray-500'}`} />
                    <h3 className="font-medium">{role.name}</h3>
                    {role.is_system_role && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Role Details & Permissions */}
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Role Details</CardTitle>
                <CardDescription>
                  {selectedRole 
                    ? `Viewing ${selectedRole.name} role permissions` 
                    : 'Select a role to view details'}
                </CardDescription>
              </div>
              
              {selectedRole && (
                <div className="flex items-center gap-2">
                  {isEditingRole ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingRole(false);
                          setEditedPermissions(selectedRole.permissions);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSavePermissions}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingRole(true)}
                      disabled={(selectedRole.id === 'owner' || selectedRole.id === 'admin' || selectedRole.id === 'member') && selectedRole.is_system_role}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Permissions
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedRole ? (
              <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                <Shield className="h-16 w-16 mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No Role Selected</h3>
                <p>Select a role from the list to view or edit its permissions</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Shield className={`h-5 w-5 mr-2 ${selectedRole.id === 'owner' ? 'text-red-500' : selectedRole.id === 'admin' ? 'text-blue-500' : selectedRole.id === 'moderator' ? 'text-yellow-500' : 'text-gray-500'}`} />
                    {selectedRole.name}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4">
                    {selectedRole.description}
                  </p>
                  
                  {(selectedRole.id === 'owner' || selectedRole.id === 'admin') && selectedRole.is_system_role && (
                    <Alert className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>System Role</AlertTitle>
                      <AlertDescription>
                        This is a system role with fixed permissions that cannot be modified.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-4">Permissions</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="delete_content">Delete Content</Label>
                        <p className="text-sm text-muted-foreground">
                          Can remove posts, comments, and messages
                        </p>
                      </div>
                      <Switch
                        id="delete_content"
                        checked={editedPermissions.can_delete_content}
                        onCheckedChange={() => isEditingRole && handleTogglePermission('can_delete_content')}
                        disabled={!isEditingRole || (selectedRole.is_system_role && (selectedRole.id === 'owner' || selectedRole.id === 'admin' || selectedRole.id === 'member'))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ban_users">Ban Users</Label>
                        <p className="text-sm text-muted-foreground">
                          Can temporarily or permanently restrict user access
                        </p>
                      </div>
                      <Switch
                        id="ban_users"
                        checked={editedPermissions.can_ban_users}
                        onCheckedChange={() => isEditingRole && handleTogglePermission('can_ban_users')}
                        disabled={!isEditingRole || (selectedRole.is_system_role && (selectedRole.id === 'owner' || selectedRole.id === 'admin' || selectedRole.id === 'member'))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="edit_content">Edit User Content</Label>
                        <p className="text-sm text-muted-foreground">
                          Can edit or modify content created by other users
                        </p>
                      </div>
                      <Switch
                        id="edit_content"
                        checked={editedPermissions.can_edit_user_content}
                        onCheckedChange={() => isEditingRole && handleTogglePermission('can_edit_user_content')}
                        disabled={!isEditingRole || (selectedRole.is_system_role && (selectedRole.id === 'owner' || selectedRole.id === 'admin' || selectedRole.id === 'member'))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="approve_flagged">Approve Flagged Content</Label>
                        <p className="text-sm text-muted-foreground">
                          Can review and approve content that has been flagged
                        </p>
                      </div>
                      <Switch
                        id="approve_flagged"
                        checked={editedPermissions.can_approve_flagged_content}
                        onCheckedChange={() => isEditingRole && handleTogglePermission('can_approve_flagged_content')}
                        disabled={!isEditingRole || (selectedRole.is_system_role && (selectedRole.id === 'owner' || selectedRole.id === 'admin' || selectedRole.id === 'member'))}
                      />
                    </div>
                  </div>
                </div>
                
                {selectedRole.id === 'moderator' && isEditingRole && (
                  <>
                    <Separator />
                    
                    <div>
                      <Button
                        variant="secondary"
                        onClick={handleApplyRoleChanges}
                        disabled={loading}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Apply to Existing Users
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        This will update permissions for all users with the {selectedRole.name} role.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Role Changes</DialogTitle>
            <DialogDescription>
              This will update permissions for all existing users with the {selectedRole?.name} role.
              Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmApplyRoleChanges}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Apply Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement; 