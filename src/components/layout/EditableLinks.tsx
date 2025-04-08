
import React, { useState } from 'react';
import { Download, Edit, Trash2, Link as LinkIcon, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export interface LinkItem {
  id: string;
  icon: React.ReactNode;
  text: string;
  url: string;
}

interface EditableLinkProps {
  link: LinkItem;
  onEdit: (id: string, text: string, url: string) => void;
  onDelete: (id: string) => void;
}

const EditableLink: React.FC<EditableLinkProps> = ({ link, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(link.text);
  const [url, setUrl] = useState(link.url);

  const handleSave = () => {
    if (text.trim()) {
      onEdit(link.id, text, url);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setText(link.text);
    setUrl(link.url);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col space-y-2 p-2 border border-gray-700 rounded-md">
        <Input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Link text" 
          className="text-sm"
        />
        <Input 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="URL" 
          className="text-sm"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        {link.icon}
        <span>{link.text}</span>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(link.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface EditableLinksProps {
  className?: string;
}

const EditableLinks: React.FC<EditableLinksProps> = ({ className }) => {
  const [links, setLinks] = useState<LinkItem[]>([
    { id: '1', icon: <Download size={16} />, text: 'Download Android app', url: 'https://play.google.com/store' },
    { id: '2', icon: <Download size={16} />, text: 'Download iOS app', url: 'https://apps.apple.com' },
  ]);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [newLinkText, setNewLinkText] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const { toast } = useToast();

  const handleEditLink = (id: string, text: string, url: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, text, url } : link
    ));
    toast({
      description: "Link updated successfully",
    });
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast({
      description: "Link removed successfully",
    });
  };

  const handleAddLink = () => {
    if (newLinkText.trim()) {
      const newLink: LinkItem = {
        id: Date.now().toString(),
        icon: <LinkIcon size={16} />,
        text: newLinkText,
        url: newLinkUrl || '#',
      };
      setLinks([...links, newLink]);
      setNewLinkText('');
      setNewLinkUrl('');
      setIsAddLinkOpen(false);
      toast({
        description: "New link added successfully",
      });
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs uppercase font-semibold text-nortech-gray-text">Links</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsAddLinkOpen(true)}
          className="h-6 text-xs"
        >
          Add Link
        </Button>
      </div>
      
      <div className="space-y-3">
        {links.map(link => (
          <EditableLink 
            key={link.id} 
            link={link} 
            onEdit={handleEditLink} 
            onDelete={handleDeleteLink} 
          />
        ))}
      </div>

      <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
            <DialogDescription>
              Add a link to resources or external websites for your community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="linkText" className="text-sm font-medium">Link Text</label>
              <Input
                id="linkText"
                value={newLinkText}
                onChange={(e) => setNewLinkText(e.target.value)}
                placeholder="e.g., Documentation, Resources"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="linkUrl" className="text-sm font-medium">URL</label>
              <Input
                id="linkUrl"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLinkOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLink}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditableLinks;
