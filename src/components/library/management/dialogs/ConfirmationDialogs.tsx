
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this content? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface CloneConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CloneConfirmation: React.FC<CloneConfirmationProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clone Content</DialogTitle>
          <DialogDescription>
            Do you want to create a duplicate of this content?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>
            Clone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
