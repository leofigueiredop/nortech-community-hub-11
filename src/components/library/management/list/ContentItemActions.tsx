
import React from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical, Copy } from 'lucide-react';

interface ContentItemActionsProps {
  item: ContentItem;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
}

export const ContentItemActions: React.FC<ContentItemActionsProps> = ({ 
  item, 
  onEdit, 
  onDelete, 
  onClone 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(item)}>
          <Edit size={14} className="mr-2" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onClone(item.id)}>
          <Copy size={14} className="mr-2" /> Clone
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-600">
          <Trash2 size={14} className="mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
