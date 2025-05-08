import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertCircle, 
  Download, 
  Trash2, 
  Loader2
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
import { useNavigate } from 'react-router-dom';

const AdvancedSettings: React.FC = () => {
  const { user, community, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = useState(false);
  const [deletionConfirmation, setDeletionConfirmation] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Role permissions - Only the owner can access advanced settings
  const effectiveRole = user?.communityRole || user?.role || 'member';
  const isOwner = effectiveRole === 'owner';
  
  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      // In production, this would generate a data export
      // For now, we'll just simulate it
      setTimeout(() => {
        // Create a mock JSON object
        const mockData = {
          community: {
            id: community?.id,
            name: community?.name,
            description: community?.description,
            created_at: new Date().toISOString(),
          },
          members: [
            { id: '1', email: 'owner@example.com', role: 'owner' },
            { id: '2', email: 'admin@example.com', role: 'admin' },
            { id: '3', email: 'member@example.com', role: 'member' },
          ],
          content: {
            posts: 42,
            comments: 128,
            media: 15
          }
        };
        
        // Create a blob and download it
        const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${community?.name?.replace(/\s+/g, '-').toLowerCase() || 'community'}-export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: 'Data Export Complete',
          description: 'Your community data has been exported.',
        });
      }, 2000);
    } catch (error: any) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Error exporting data',
        description: error.message || 'There was an error exporting your data.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleDeleteCommunity = async () => {
    if (deletionConfirmation !== community?.name) {
      toast({
        title: 'Confirmation Failed',
        description: 'The community name you entered does not match.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In production, this would delete the community
      // For now, we'll just simulate it
      setTimeout(() => {
        toast({
          title: 'Community Deleted',
          description: 'Your community has been permanently deleted.',
        });
        
        setIsDeletionDialogOpen(false);
        setTimeout(() => {
          logout();
        }, 2000);
      }, 2000);
    } catch (error: any) {
      console.error('Error deleting community:', error);
      toast({
        title: 'Error deleting community',
        description: error.message || 'There was an error deleting your community.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };
  
  // If not owner, show restricted message
  if (!isOwner) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>
              Configure advanced options for your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Restricted</AlertTitle>
              <AlertDescription>
                Only the community owner can access advanced settings.
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
        <h1 className="text-2xl font-bold">Advanced Settings</h1>
        <p className="text-muted-foreground">
          Configure advanced options for your community
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Export your community data for backup or migration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Export all of your community data, including members, content, and settings.
            This can be used for backup purposes or to migrate to another platform.
          </p>
          <Button 
            onClick={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing Export...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border-red-300 dark:border-red-900">
        <CardHeader className="bg-red-50 dark:bg-red-950/50 rounded-t-lg">
          <CardTitle className="text-red-700 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription className="text-red-600/80 dark:text-red-400/80">
            These actions are destructive and cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              The actions below are permanent and irreversible. 
              Proceed with extreme caution.
            </AlertDescription>
          </Alert>
          
          <div className="border border-red-300 dark:border-red-900 rounded-md p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 flex items-center">
                <Trash2 className="mr-2 h-5 w-5" />
                Delete Community
              </h3>
              <p className="text-muted-foreground mt-1">
                Permanently delete this community and all of its data, including members, content, and settings.
                This action cannot be undone.
              </p>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={() => setIsDeletionDialogOpen(true)}
            >
              Delete Community
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Community Deletion Dialog */}
      <Dialog open={isDeletionDialogOpen} onOpenChange={setIsDeletionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Community</DialogTitle>
            <DialogDescription>
              This action is irreversible. All data including members, content, and settings will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This will permanently delete the community "{community?.name}".
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-delete">
                Type <span className="font-semibold">{community?.name}</span> to confirm:
              </Label>
              <Input
                id="confirm-delete"
                value={deletionConfirmation}
                onChange={(e) => setDeletionConfirmation(e.target.value)}
                placeholder={community?.name}
                className="border-red-300"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeletionDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCommunity}
              disabled={deletionConfirmation !== community?.name || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Permanently Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedSettings; 