
import React from 'react';
import { ContentItem, ContentCategory } from '@/types/library';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ContentFormatIcon } from '../utils/ContentFormatIcon';
import { ContentItemActions } from './ContentItemActions';
import { Lock } from 'lucide-react';

interface ContentListViewProps {
  items: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
  categories: ContentCategory[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: string) => void;
  renderSortIcon: (field: string) => React.ReactNode;
}

const ContentListView: React.FC<ContentListViewProps> = ({ 
  items, 
  onEdit, 
  onDelete, 
  onClone,
  categories,
  sortBy,
  sortOrder,
  handleSort,
  renderSortIcon
}) => {
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Type</TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('title')}
          >
            <div className="flex items-center gap-1">
              Title {renderSortIcon('title')}
            </div>
          </TableHead>
          <TableHead>Category</TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('accessLevel')}
          >
            <div className="flex items-center gap-1">
              Access {renderSortIcon('accessLevel')}
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer text-right"
            onClick={() => handleSort('views')}
          >
            <div className="flex items-center gap-1 justify-end">
              Views {renderSortIcon('views')}
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('updatedAt')}
          >
            <div className="flex items-center gap-1">
              Updated {renderSortIcon('updatedAt')}
            </div>
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell><ContentFormatIcon format={item.format} /></TableCell>
            <TableCell>
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-slate-500 line-clamp-1">{item.description}</div>
            </TableCell>
            <TableCell>{getCategoryName(item.categoryId)}</TableCell>
            <TableCell>
              {item.accessLevel === 'premium' ? (
                <Badge variant="secondary" className="bg-amber-500 text-white">
                  <Lock size={12} className="mr-1" /> Premium
                </Badge>
              ) : (
                <Badge variant="outline">Free</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">{item.views.toLocaleString()}</TableCell>
            <TableCell>
              {new Date(item.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <ContentItemActions 
                item={item} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                onClone={onClone} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ContentListView;
