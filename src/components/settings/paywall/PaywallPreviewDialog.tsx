
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PaywallPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: React.ReactNode;
}

const PaywallPreviewDialog: React.FC<PaywallPreviewDialogProps> = ({ 
  open, 
  onOpenChange, 
  template 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Paywall Preview</DialogTitle>
          <DialogDescription>
            This is how your paywall will appear to users when they access premium content
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {template}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close Preview</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallPreviewDialog;
