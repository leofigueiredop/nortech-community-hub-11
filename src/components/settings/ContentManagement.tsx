import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  MessageSquare, 
  Filter, 
  Search, 
  Loader2, 
  Eye, 
  Edit, 
  Trash2, 
  Shield 
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentItem {
  id: string;
  title: string;
  content_type: 'post' | 'comment' | 'message';
  status: 'published' | 'pending' | 'rejected' | 'flagged';
  created_at: string;
  text_preview: string;
  user: {
    id: string;
    profile: {
      full_name: string;
      avatar_url: string | null;
    }
  }
}

const ContentManagement: React.FC = () => {
  const { user, community } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Role permissions
  const effectiveRole = user?.communityRole || user?.role || 'member';
  const isOwner = effectiveRole === 'owner';
  const isAdmin = effectiveRole === 'owner' || effectiveRole === 'admin';
  const isModerator = effectiveRole === 'moderator' || isAdmin;
  const canManageContent = isAdmin || (isModerator && user?.moderatorPermissions?.can_edit_user_content);
  
  // Mock content items for demonstration (would be replaced with Supabase query in production)
  useEffect(() => {
    if (community?.id && canManageContent) {
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data
      const mockContent: ContentItem[] = [
        {
          id: '1',
          title: 'Getting Started with React',
          content_type: 'post',
          status: 'published',
          created_at: new Date().toISOString(),
          text_preview: 'Learn the basics of React including components, props, and state...',
          user: {
            id: '101',
            profile: {
              full_name: 'John Developer',
              avatar_url: null
            }
          }
        },
        {
          id: '2',
          title: 'Comment on TypeScript Tutorial',
          content_type: 'comment',
          status: 'flagged',
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          text_preview: 'This tutorial is completely wrong! You should never use TypeScript like this...',
          user: {
            id: '102',
            profile: {
              full_name: 'Angry User',
              avatar_url: null
            }
          }
        },
        {
          id: '3',
          title: 'Help with Node.js Error',
          content_type: 'post',
          status: 'pending',
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          text_preview: 'I\'m getting this error when trying to run my Node.js app: Error: Cannot find module...',
          user: {
            id: '103',
            profile: {
              full_name: 'New Member',
              avatar_url: null
            }
          }
        },
        {
          id: '4',
          title: 'Direct message to admin',
          content_type: 'message',
          status: 'pending',
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          text_preview: 'Hello, I wanted to discuss the possibility of organizing a community event...',
          user: {
            id: '104',
            profile: {
              full_name: 'Event Planner',
              avatar_url: null
            }
          }
        },
        {
          id: '5',
          title: 'Inappropriate content report',
          content_type: 'post',
          status: 'rejected',
          created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          text_preview: 'This content was rejected because it violated community guidelines...',
          user: {
            id: '105',
            profile: {
              full_name: 'Problematic User',
              avatar_url: null
            }
          }
        }
      ];
      
      setContentItems(mockContent);
      setLoading(false);
      
      // In production, the fetch would look something like this:
      /*
      const fetchContent = async () => {
        try {
          const { data, error } = await supabase
            .from('content_items')
            .select(`
              id,
              title,
              content_type,
              status,
              created_at,
              text_preview,
              user:user_id (
                id,
                profile:profiles (
                  full_name,
                  avatar_url
                )
              )
            `)
            .eq('community_id', community.id)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          setContentItems(data);
        } catch (error) {
          console.error('Error fetching content:', error);
          setError('Failed to load content items.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchContent();
      */
    } else {
      setLoading(false);
    }
  }, [community, canManageContent]);
  
  const handleApproveContent = async (item: ContentItem) => {
    setIsActionInProgress(true);
    
    try {
      // In production, this would update the item in Supabase
      // For now, we'll just update the local state
      setContentItems(contentItems.map(content => 
        content.id === item.id 
          ? { ...content, status: 'published' } 
          : content
      ));
      
      toast({
        title: 'Content approved',
        description: 'The content has been approved and published.',
      });
    } catch (error: any) {
      console.error('Error approving content:', error);
      toast({
        title: 'Error approving content',
        description: error.message || 'Failed to approve content.',
        variant: 'destructive',
      });
    } finally {
      setIsActionInProgress(false);
    }
  };
  
  const handleRejectContent = async (item: ContentItem) => {
    setIsActionInProgress(true);
    
    try {
      // In production, this would update the item in Supabase
      // For now, we'll just update the local state
      setContentItems(contentItems.map(content => 
        content.id === item.id 
          ? { ...content, status: 'rejected' } 
          : content
      ));
      
      toast({
        title: 'Content rejected',
        description: 'The content has been rejected.',
      });
    } catch (error: any) {
      console.error('Error rejecting content:', error);
      toast({
        title: 'Error rejecting content',
        description: error.message || 'Failed to reject content.',
        variant: 'destructive',
      });
    } finally {
      setIsActionInProgress(false);
    }
  };
  
  const handleDeleteContent = async () => {
    if (!selectedItem) return;
    
    setIsActionInProgress(true);
    
    try {
      // In production, this would delete the item from Supabase
      // For now, we'll just update the local state
      setContentItems(contentItems.filter(content => content.id !== selectedItem.id));
      
      toast({
        title: 'Content deleted',
        description: 'The content has been permanently deleted.',
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Error deleting content',
        description: error.message || 'Failed to delete content.',
        variant: 'destructive',
      });
    } finally {
      setIsActionInProgress(false);
    }
  };
  
  // Filter content items
  const filteredItems = contentItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text_preview.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.content_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // If not authorized to manage content, show restricted message
  if (!canManageContent) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>
              Moderate and manage community content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                You need appropriate permissions to manage community content.
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
        <h1 className="text-2xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">
          Moderate and manage community content
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="all" className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList className="mb-0">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-wrap gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full sm:w-[240px]"
              />
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <TabsContent value="all" className="mt-0">
              {renderContentTable(filteredItems)}
            </TabsContent>
            
            <TabsContent value="flagged" className="mt-0">
              {renderContentTable(filteredItems.filter(item => item.status === 'flagged'))}
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              {renderContentTable(filteredItems.filter(item => item.status === 'pending'))}
            </TabsContent>
            
            <TabsContent value="published" className="mt-0">
              {renderContentTable(filteredItems.filter(item => item.status === 'published'))}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      {/* View Content Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>View Content</DialogTitle>
            <DialogDescription>
              Reviewing {selectedItem?.content_type}: {selectedItem?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {selectedItem?.user.profile.avatar_url ? (
                    <img 
                      src={selectedItem.user.profile.avatar_url} 
                      alt={selectedItem.user.profile.full_name}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="text-gray-500 font-medium">
                      {selectedItem?.user.profile.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{selectedItem?.user.profile.full_name}</div>
                  <div className="text-xs text-muted-foreground">
                    Posted on {new Date(selectedItem?.created_at || '').toLocaleString()}
                  </div>
                </div>
              </div>
              
              <Badge
                variant={
                  selectedItem?.status === 'published' ? 'default' : 
                  selectedItem?.status === 'pending' ? 'outline' : 
                  selectedItem?.status === 'flagged' ? 'destructive' : 
                  'secondary'
                }
              >
                {selectedItem?.status.charAt(0).toUpperCase() + selectedItem?.status.slice(1)}
              </Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">{selectedItem?.title}</h3>
              <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900 min-h-[100px]">
                <p>{selectedItem?.text_preview}</p>
                <p className="text-muted-foreground mt-4">
                  [Full content would be displayed here]
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={() => {
                  setIsViewDialogOpen(false);
                  setIsDeleteDialogOpen(true);
                }}
                disabled={isActionInProgress}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
              
              {selectedItem?.status !== 'rejected' && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleRejectContent(selectedItem!);
                    setIsViewDialogOpen(false);
                  }}
                  disabled={isActionInProgress}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              )}
              
              {selectedItem?.status !== 'published' && (
                <Button
                  onClick={() => {
                    handleApproveContent(selectedItem!);
                    setIsViewDialogOpen(false);
                  }}
                  disabled={isActionInProgress}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isActionInProgress}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteContent}
              disabled={isActionInProgress}
            >
              {isActionInProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Permanently'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
  
  function renderContentTable(items: ContentItem[]) {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
            ? "No content matches your filters"
            : "No content found"
          }
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Content</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="max-w-[300px] truncate">{item.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {item.text_preview.substring(0, 60)}...
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {item.content_type === 'post' && <FileText className="mr-1 h-3 w-3" />}
                  {item.content_type === 'comment' && <MessageSquare className="mr-1 h-3 w-3" />}
                  {item.content_type === 'message' && <MessageSquare className="mr-1 h-3 w-3" />}
                  {item.content_type}
                </Badge>
              </TableCell>
              <TableCell>{item.user.profile.full_name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === 'published' ? 'default' : 
                    item.status === 'pending' ? 'outline' : 
                    item.status === 'flagged' ? 'destructive' : 
                    'secondary'
                  }
                >
                  {item.status === 'published' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                  {item.status === 'pending' && <AlertCircle className="mr-1 h-3 w-3" />}
                  {item.status === 'flagged' && <Shield className="mr-1 h-3 w-3" />}
                  {item.status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-4 w-4"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedItem(item);
                        setIsViewDialogOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    
                    {item.status !== 'published' && (
                      <DropdownMenuItem
                        onClick={() => handleApproveContent(item)}
                        className="cursor-pointer"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                    )}
                    
                    {item.status !== 'rejected' && (
                      <DropdownMenuItem
                        onClick={() => handleRejectContent(item)}
                        className="cursor-pointer"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
};

export default ContentManagement; 