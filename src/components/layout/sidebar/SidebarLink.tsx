
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  additionalPaths?: string[];
  canDelete?: boolean;
  onDelete?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  icon, 
  label, 
  additionalPaths = [],
  canDelete = false,
  onDelete
}) => {
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const { toast } = useToast();

  const isActive = location.pathname === to || additionalPaths.includes(location.pathname);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deleteText.toLowerCase() === 'delete') {
      onDelete?.();
      setShowDeleteDialog(false);
      setDeleteText('');
      toast({
        title: "Item deleted",
        description: `${label} has been removed successfully.`,
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
      <div 
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Link
          to={to}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
            isActive 
              ? "bg-nortech-purple/10 text-nortech-purple font-medium" 
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-nortech-purple transition-colors"
          }`}
        >
          {icon}
          <span>{label}</span>
        </Link>
        
        {canDelete && isHovering && (
          <button 
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1 bg-red-100 dark:bg-red-900 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            onClick={handleDeleteClick}
          >
            <X size={12} className="text-red-600 dark:text-red-300" />
          </button>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove 
              "{label}" from your sidebar.
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
              Delete Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SidebarLink;
