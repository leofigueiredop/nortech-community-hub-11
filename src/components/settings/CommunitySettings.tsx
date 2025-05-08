import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Home, Users, Settings, Save, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CommunitySettings: React.FC = () => {
  const { user, community } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [communityType, setCommunityType] = useState('public');
  const [membershipRequiresApproval, setMembershipRequiresApproval] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Role permissions
  const effectiveRole = user?.communityRole || user?.role || 'member';
  const isOwnerOrAdmin = effectiveRole === 'owner' || effectiveRole === 'admin';
  
  // Load community data
  useEffect(() => {
    if (community) {
      setName(community.name || '');
      setDescription(community.description || '');
      
      // Fetch additional community settings
      const fetchCommunitySettings = async () => {
        try {
          const { data, error } = await supabase
            .from('communities')
            .select('type, membership_requires_approval')
            .eq('id', community.id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setCommunityType(data.type || 'public');
            setMembershipRequiresApproval(data.membership_requires_approval || false);
          }
        } catch (error) {
          console.error('Error fetching community settings:', error);
          setError('Could not load community settings. Please try refreshing the page.');
        }
      };
      
      fetchCommunitySettings();
    }
  }, [community]);
  
  const handleUpdateCommunity = async () => {
    if (!community?.id) return;
    
    // Validate fields
    if (!name.trim()) {
      setError('Community name cannot be empty');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Update community in database
      const { error } = await supabase
        .from('communities')
        .update({
          name,
          description,
          type: communityType,
          membership_requires_approval: membershipRequiresApproval,
          updated_at: new Date().toISOString()
        })
        .eq('id', community.id);
        
      if (error) throw error;
      
      toast({
        title: 'Community updated',
        description: 'Your community settings have been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating community:', error);
      setError(error.message || 'There was an error updating your community settings.');
      toast({
        title: 'Update failed',
        description: error.message || 'There was an error updating your community settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // If not owner or admin, show restricted message
  if (!isOwnerOrAdmin) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Community Settings</CardTitle>
            <CardDescription>
              Manage your community configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                You need to be an owner or administrator to access community settings.
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
        <h1 className="text-2xl font-bold">Community Settings</h1>
        <p className="text-muted-foreground">
          Manage your community configuration
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="membership" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Membership
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic information about your community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Community Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter community name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your community..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="membership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Membership Settings</CardTitle>
              <CardDescription>
                Configure how people join your community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label>Community Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      communityType === 'public' 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setCommunityType('public')}
                  >
                    <div className="font-medium mb-1">Public</div>
                    <p className="text-sm text-muted-foreground">
                      Anyone can see community content. Membership may require approval.
                    </p>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      communityType === 'private' 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setCommunityType('private')}
                  >
                    <div className="font-medium mb-1">Private</div>
                    <p className="text-sm text-muted-foreground">
                      Only members can see community content. Membership is by invitation only.
                    </p>
                  </div>
                </div>
              </div>
              
              {communityType === 'public' && (
                <div className="flex items-start space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="requireApproval"
                    checked={membershipRequiresApproval}
                    onChange={(e) => setMembershipRequiresApproval(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
                  />
                  <div>
                    <Label htmlFor="requireApproval" className="font-medium">
                      Require Membership Approval
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      New members must be approved by an admin before they can join
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Advanced configuration for your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Advanced settings</AlertTitle>
                <AlertDescription>
                  Additional advanced settings will be available in future updates.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button
          onClick={handleUpdateCommunity}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Community Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CommunitySettings; 