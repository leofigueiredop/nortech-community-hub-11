
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

interface PreviewAffiliateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PreviewAffiliateDialog: React.FC<PreviewAffiliateDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const affiliateLink = "https://yoursite.com/ref/123"; // This would be dynamic in production

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link copied!",
      description: "The affiliate link has been copied to your clipboard.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Preview Affiliate Page</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/10">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Your Affiliate Link</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm">{affiliateLink}</code>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="aspect-video rounded-lg border bg-card p-4 flex items-center justify-center">
              <p className="text-muted-foreground">Preview of your affiliate landing page will appear here</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewAffiliateDialog;
