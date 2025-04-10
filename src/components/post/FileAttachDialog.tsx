
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileAttachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileAttachDialog: React.FC<FileAttachDialogProps> = ({
  open,
  onOpenChange,
  onFileSelect,
  fileInputRef
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Attach files</DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload images, documents, or other files to your post
          </DialogDescription>
        </DialogHeader>
        
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
              <Upload size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-300">Drop your files here to attach them</p>
            
            <Button 
              variant="outline" 
              className="mt-2 border-gray-700"
              onClick={onFileSelect}
            >
              Choose file
            </Button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              onChange={(e) => {
                // The onChange handler is handled in the parent component
                // This is just to make the ref work
              }}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileAttachDialog;
