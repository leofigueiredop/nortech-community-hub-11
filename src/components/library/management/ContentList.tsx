
import React, { useState } from 'react';
import { ContentItem, ContentCategory } from '@/types/content';
import ContentListView from './list/ContentListView';
import ContentGridView from './grid/ContentGridView';
import { DeleteConfirmation, CloneConfirmation } from './dialogs/ConfirmationDialogs';
import { useToast } from '@/hooks/use-toast';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ContentListProps {
  items: ContentItem[];
  viewMode: 'list' | 'grid';
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  categories: ContentCategory[];
}

const ContentList: React.FC<ContentListProps> = ({ 
  items, 
  viewMode, 
  onEdit, 
  onDelete, 
  categories 
}) => {
  const [sortBy, setSortBy] = useState<string>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [cloneId, setCloneId] = useState<string | null>(null);
  const { toast } = useToast();

  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'format') {
      comparison = String(a.format).localeCompare(String(b.format));
    } else if (sortBy === 'access_level') {
      comparison = String(a.access_level).localeCompare(String(b.access_level));
    } else if (sortBy === 'updated_at') {
      comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
    } else if (sortBy === 'views') {
      comparison = (a.views || 0) - (b.views || 0);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      toast({
        title: "Content deleted",
        description: "The content has been removed from your library."
      });
      setDeleteId(null);
    }
  };

  const handleClone = () => {
    if (cloneId) {
      const original = items.find(item => item.id === cloneId);
      if (original) {
        const clone: ContentItem = {
          ...original,
          id: `clone-${cloneId}`,
          title: `Copy of ${original.title}`,
          views: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        onEdit(clone);
        toast({
          title: "Content cloned",
          description: `"${original.title}" has been cloned successfully.`
        });
      }
      setCloneId(null);
    }
  };

  return (
    <div>
      {viewMode === 'list' ? (
        <ContentListView 
          items={sortedItems}
          onEdit={onEdit}
          onDelete={(id) => setDeleteId(id)}
          onClone={(id) => setCloneId(id)}
          categories={categories}
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleSort={handleSort}
          renderSortIcon={renderSortIcon}
        />
      ) : (
        <ContentGridView 
          items={sortedItems}
          onEdit={onEdit}
          onDelete={(id) => setDeleteId(id)}
          onClone={(id) => setCloneId(id)}
        />
      )}

      {/* Confirmation Dialogs */}
      <DeleteConfirmation 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete} 
      />
      
      <CloneConfirmation 
        isOpen={!!cloneId} 
        onClose={() => setCloneId(null)} 
        onConfirm={handleClone} 
      />
    </div>
  );
};

export default ContentList;
