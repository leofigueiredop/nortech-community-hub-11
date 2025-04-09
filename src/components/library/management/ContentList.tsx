
import React, { useState } from 'react';
import { ContentItem, ContentCategory } from '@/types/library';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical, Eye, Copy, Link, FileText, FileVideo, FileAudio, Image, Lock, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ContentListProps {
  items: ContentItem[];
  viewMode: 'list' | 'grid';
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  categories: ContentCategory[];
}

const ContentList: React.FC<ContentListProps> = ({ items, viewMode, onEdit, onDelete, categories }) => {
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [cloneId, setCloneId] = useState<string | null>(null);
  const { toast } = useToast();

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <FileVideo size={16} />;
      case 'pdf':
      case 'gdoc':
        return <FileText size={16} />;
      case 'audio':
        return <FileAudio size={16} />;
      case 'image':
        return <Image size={16} />;
      case 'link':
      case 'gdrive':
      default:
        return <Link size={16} />;
    }
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'format') {
      comparison = a.format.localeCompare(b.format);
    } else if (sortBy === 'accessLevel') {
      comparison = a.accessLevel.localeCompare(b.accessLevel);
    } else if (sortBy === 'updatedAt') {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else if (sortBy === 'views') {
      comparison = a.views - b.views;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const confirmDelete = (id: string) => {
    onDelete(id);
    setDeleteId(null);
  };

  const handleClone = (id: string) => {
    const original = items.find(item => item.id === id);
    if (original) {
      const clone = {
        ...original,
        id: `clone-${id}`,
        title: `Copy of ${original.title}`,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onEdit(clone);
      toast({
        title: "Content cloned",
        description: `"${original.title}" has been cloned successfully.`
      });
    }
    setCloneId(null);
  };

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

  return (
    <div>
      {viewMode === 'list' ? (
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
            {sortedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{getFormatIcon(item.format)}</TableCell>
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
                      <DropdownMenuItem onClick={() => setCloneId(item.id)}>
                        <Copy size={14} className="mr-2" /> Clone
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(item.id)} className="text-red-600">
                        <Trash2 size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video relative bg-slate-100 dark:bg-slate-800">
                <img 
                  src={item.thumbnailUrl || '/placeholder.svg'} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.accessLevel === 'premium' && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-amber-500 text-white">
                      <Lock size={12} className="mr-1" /> Premium
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-1 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center text-xs text-slate-500 mb-2">
                      {getFormatIcon(item.format)}
                      <span className="ml-1">{item.format.toUpperCase()}</span>
                      <span className="mx-1">•</span>
                      <Eye size={12} className="mr-1" />
                      {item.views.toLocaleString()}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit size={14} className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCloneId(item.id)}>
                        <Copy size={14} className="mr-2" /> Clone
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(item.id)} className="text-red-600">
                        <Trash2 size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && confirmDelete(deleteId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clone Confirmation Dialog */}
      <Dialog open={!!cloneId} onOpenChange={() => setCloneId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Content</DialogTitle>
            <DialogDescription>
              Do you want to create a duplicate of this content?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloneId(null)}>Cancel</Button>
            <Button onClick={() => cloneId && handleClone(cloneId)}>
              Clone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentList;
