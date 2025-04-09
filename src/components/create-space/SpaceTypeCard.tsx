
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface SpaceTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  onDelete?: () => void;
}

const SpaceTypeCard: React.FC<SpaceTypeCardProps> = ({ 
  icon, 
  title, 
  description, 
  onClick,
  onDelete 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const { toast } = useToast();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteText.toLowerCase() === 'delete') {
      onDelete?.();
      setShowDeleteDialog(false);
      setDeleteText('');
      toast({
        title: "Space deleted",
        description: `${title} has been deleted successfully.`,
      });
    } else {
      toast({
        title: "Deletion canceled",
        description: "Please type 'delete' to confirm.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Card 
        className={`cursor-pointer hover:border-nortech-purple transition-colors relative ${isHovering ? 'border-nortech-purple' : ''}`} 
        onClick={onClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {onDelete && isHovering && (
          <div 
            className="absolute top-2 right-2 z-10 p-1 bg-red-100 dark:bg-red-900 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            onClick={handleDeleteClick}
          >
            <X size={14} className="text-red-600 dark:text-red-300" />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-nortech-purple/10 p-2 rounded-lg">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this space?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              "{title}" space and all of its associated content.
              <div className="mt-4">
                <p className="mb-2 text-sm">Type <strong>delete</strong> to confirm:</p>
                <Input 
                  value={deleteText} 
                  onChange={(e) => setDeleteText(e.target.value)} 
                  placeholder="delete"
                  className="mb-2"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteText('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteText.toLowerCase() !== 'delete'}
            >
              Delete Space
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SpaceTypeCard;
