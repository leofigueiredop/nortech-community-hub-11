import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { ContentItem } from '@/types/library';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  FileText, 
  Film, 
  Music, 
  Link as LinkIcon, 
  Brain, 
  Plus, 
  BarChart3, 
  Settings, 
  Search, 
  LayoutGrid, 
  List, 
  ChevronDown,
  Star,
  MoreVertical
} from 'lucide-react';
import CreateContentModal from '@/components/library/CreateContentModal';

const ContentCreatorDashboard: React.FC = () => {
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  
  const {
    content,
    updateContent,
    deleteContent,
    addContent,
  } = useLibraryContent();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEdit = (item: ContentItem) => {
    setEditingContent(item);
    setIsCreateContentOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteContent(id);
      toast.success('Content deleted successfully');
    }
  };
  
  const handleDuplicate = (id: string) => {
    const contentToDuplicate = content.find(item => item.id === id);
    if (contentToDuplicate) {
      const duplicatedContent = {
        ...contentToDuplicate,
        id: crypto.randomUUID(),
        title: `${contentToDuplicate.title} (Copy)`,
        featured: false,
        views: 0,
        createdAt: new Date().toISOString()
      };
      addContent(duplicatedContent);
      toast.success('Content duplicated successfully');
    }
  };
  
  const toggleFeatured = (id: string, isFeatured: boolean) => {
    const itemToUpdate = content.find(item => item.id === id);
    if (itemToUpdate) {
      updateContent({
        ...itemToUpdate,
        featured: !isFeatured
      });
      toast.success(`Content ${!isFeatured ? 'added to' : 'removed from'} featured section`);
    }
  };
  
  const toggleTopTen = (id: string, isTopTen: boolean) => {
    const itemToUpdate = content.find(item => item.id === id);
    if (itemToUpdate) {
      updateContent({
        ...itemToUpdate,
        isTopTen: !isTopTen
      });
      toast.success(`Content ${!isTopTen ? 'added to' : 'removed from'} Top 10`);
    }
  };
  
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video': return <Film size={16} className="mr-1" />;
      case 'audio': return <Music size={16} className="mr-1" />;
      case 'pdf': case 'text': return <FileText size={16} className="mr-1" />;
      case 'url': return <LinkIcon size={16} className="mr-1" />;
      default: return <Brain size={16} className="mr-1" />;
    }
  };
  
  const getAccessLevelBadge = (accessLevel: string) => {
    switch (accessLevel) {
      case 'premium':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Premium</Badge>;
      case 'free':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Free</Badge>;
      case 'unlockable':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Unlockable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <MainLayout title="Content Creator Dashboard">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Content Creator Dashboard</h1>
          <Button onClick={() => setIsCreateContentOpen(true)} className="gap-2">
            <Plus size={16} />
            <span>Create Content</span>
          </Button>
        </div>
        
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-9 w-9"
            >
              <List size={18} />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-9 w-9"
            >
              <LayoutGrid size={18} />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Content ({content.length})</TabsTrigger>
            <TabsTrigger value="featured">Featured ({content.filter(item => item.featured).length})</TabsTrigger>
            <TabsTrigger value="top10">Top 10 ({content.filter(item => item.isTopTen).length})</TabsTrigger>
            <TabsTrigger value="premium">Premium ({content.filter(item => item.accessLevel === 'premium').length})</TabsTrigger>
            <TabsTrigger value="free">Free ({content.filter(item => item.accessLevel === 'free').length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {viewMode === 'list' ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Content</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead className="text-center">XP</TableHead>
                      <TableHead className="text-center">Featured</TableHead>
                      <TableHead className="text-center">Top 10</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <FileText size={20} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate max-w-[200px]">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getFormatIcon(item.format)}
                            <span className="capitalize">{item.format}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getAccessLevelBadge(item.accessLevel)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye size={14} />
                            <span>{item.views}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.pointsValue || 0}</TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={item.featured || false} 
                            onCheckedChange={() => toggleFeatured(item.id, !!item.featured)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={item.isTopTen || false} 
                            onCheckedChange={() => toggleTopTen(item.id, !!item.isTopTen)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit size={14} className="mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(item.id)}>
                                <Copy size={14} className="mr-2" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                                <Trash2 size={14} className="mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {filteredContent.map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
                    <div className="relative aspect-video bg-gray-100">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FileText size={32} className="text-gray-500" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {item.featured && (
                          <Badge variant="secondary" className="bg-amber-500">
                            <Star size={10} className="mr-1" /> Featured
                          </Badge>
                        )}
                        {item.isTopTen && (
                          <Badge variant="secondary" className="bg-blue-500">
                            Top 10
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium truncate flex-1">{item.title}</div>
                        {getAccessLevelBadge(item.accessLevel)}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            <span>{item.views}</span>
                          </div>
                          <div className="flex items-center">
                            <BarChart3 size={12} className="mr-1" />
                            <span>{item.pointsValue || 0} XP</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(item)}>
                            <Edit size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDuplicate(item.id)}>
                            <Copy size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => handleDelete(item.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="featured" className="mt-4">
            <div className={viewMode === 'list' ? "rounded-md border" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"}>
              {viewMode === 'list' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Content</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead className="text-center">XP</TableHead>
                      <TableHead className="text-center">Featured</TableHead>
                      <TableHead className="text-center">Top 10</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.filter(item => item.featured).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <FileText size={20} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate max-w-[200px]">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getFormatIcon(item.format)}
                            <span className="capitalize">{item.format}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getAccessLevelBadge(item.accessLevel)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye size={14} />
                            <span>{item.views}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.pointsValue || 0}</TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={item.featured || false} 
                            onCheckedChange={() => toggleFeatured(item.id, !!item.featured)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={item.isTopTen || false} 
                            onCheckedChange={() => toggleTopTen(item.id, !!item.isTopTen)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit size={14} className="mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(item.id)}>
                                <Copy size={14} className="mr-2" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
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
                filteredContent.filter(item => item.featured).map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
                    <div className="relative aspect-video bg-gray-100">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FileText size={32} className="text-gray-500" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {item.featured && (
                          <Badge variant="secondary" className="bg-amber-500">
                            <Star size={10} className="mr-1" /> Featured
                          </Badge>
                        )}
                        {item.isTopTen && (
                          <Badge variant="secondary" className="bg-blue-500">
                            Top 10
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium truncate flex-1">{item.title}</div>
                        {getAccessLevelBadge(item.accessLevel)}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            <span>{item.views}</span>
                          </div>
                          <div className="flex items-center">
                            <BarChart3 size={12} className="mr-1" />
                            <span>{item.pointsValue || 0} XP</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(item)}>
                            <Edit size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDuplicate(item.id)}>
                            <Copy size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => handleDelete(item.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="top10" className="mt-4">
            <div className={viewMode === 'list' ? "rounded-md border" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"}>
              {viewMode === 'list' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Content</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead className="text-center">XP</TableHead>
                      <TableHead className="text-center">Featured</TableHead>
                      <TableHead className="text-center">Top 10</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.filter(item => item.isTopTen).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <FileText size={20} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate max-w-[200px]">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getFormatIcon(item.format)}
                            <span className="capitalize">{item.format}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getAccessLevelBadge(item.accessLevel)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye size={14} />
                            <span>{item.views}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.pointsValue || 0}</TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={item.featured || false} 
                            onCheckedChange={() => toggleFeatured(item.id, !!item.featured)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={item.isTopTen || false} 
                            onCheckedChange={() => toggleTopTen(item.id, !!item.isTopTen)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit size={14} className="mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(item.id)}>
                                <Copy size={14} className="mr-2" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
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
                filteredContent.filter(item => item.isTopTen).map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
                    <div className="relative aspect-video bg-gray-100">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FileText size={32} className="text-gray-500" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {item.featured && (
                          <Badge variant="secondary" className="bg-amber-500">
                            <Star size={10} className="mr-1" /> Featured
                          </Badge>
                        )}
                        {item.isTopTen && (
                          <Badge variant="secondary" className="bg-blue-500">
                            Top 10
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium truncate flex-1">{item.title}</div>
                        {getAccessLevelBadge(item.accessLevel)}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            <span>{item.views}</span>
                          </div>
                          <div className="flex items-center">
                            <BarChart3 size={12} className="mr-1" />
                            <span>{item.pointsValue || 0} XP</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(item)}>
                            <Edit size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDuplicate(item.id)}>
                            <Copy size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => handleDelete(item.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="premium" className="mt-4">
            <div className={viewMode === 'list' ? "rounded-md border" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"}>
              {viewMode === 'list' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Content</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead className="text-center">XP</TableHead>
                      <TableHead className="text-center">Featured</TableHead>
                      <TableHead className="text-center">Top 10</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.filter(item => item.accessLevel === 'premium').map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <FileText size={20} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate max-w-[200px]">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getFormatIcon(item.format)}
                            <span className="capitalize">{item.format}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getAccessLevelBadge(item.accessLevel)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye size={14} />
                            <span>{item.views}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.pointsValue || 0}</TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={item.featured || false} 
                            onCheckedChange={() => toggleFeatured(item.id, !!item.featured)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={item.isTopTen || false} 
                            onCheckedChange={() => toggleTopTen(item.id, !!item.isTopTen)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit size={14} className="mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(item.id)}>
                                <Copy size={14} className="mr-2" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
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
                filteredContent.filter(item => item.accessLevel === 'premium').map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
                    <div className="relative aspect-video bg-gray-100">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FileText size={32} className="text-gray-500" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {item.featured && (
                          <Badge variant="secondary" className="bg-amber-500">
                            <Star size={10} className="mr-1" /> Featured
                          </Badge>
                        )}
                        {item.isTopTen && (
                          <Badge variant="secondary" className="bg-blue-500">
                            Top 10
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium truncate flex-1">{item.title}</div>
                        {getAccessLevelBadge(item.accessLevel)}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            <span>{item.views}</span>
                          </div>
                          <div className="flex items-center">
                            <BarChart3 size={12} className="mr-1" />
                            <span>{item.pointsValue || 0} XP</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(item)}>
                            <Edit size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDuplicate(item.id)}>
                            <Copy size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => handleDelete(item.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="free" className="mt-4">
            <div className={viewMode === 'list' ? "rounded-md border" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"}>
              {viewMode === 'list' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Content</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead className="text-center">XP</TableHead>
                      <TableHead className="text-center">Featured</TableHead>
                      <TableHead className="text-center">Top 10</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.filter(item => item.accessLevel === 'free').map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <FileText size={20} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate max-w-[200px]">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getFormatIcon(item.format)}
                            <span className="capitalize">{item.format}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getAccessLevelBadge(item.accessLevel)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye size={14} />
                            <span>{item.views}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.pointsValue || 0}</TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={item.featured || false} 
                            onCheckedChange={() => toggleFeatured(item.id, !!item.featured)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={item.isTopTen || false} 
                            onCheckedChange={() => toggleTopTen(item.id, !!item.isTopTen)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit size={14} className="mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(item.id)}>
                                <Copy size={14} className="mr-2" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
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
                filteredContent.filter(item => item.accessLevel === 'free').map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
                    <div className="relative aspect-video bg-gray-100">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FileText size={32} className="text-gray-500" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {item.featured && (
                          <Badge variant="secondary" className="bg-amber-500">
                            <Star size={10} className="mr-1" /> Featured
                          </Badge>
                        )}
                        {item.isTopTen && (
                          <Badge variant="secondary" className="bg-blue-500">
                            Top 10
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium truncate flex-1">{item.title}</div>
                        {getAccessLevelBadge(item.accessLevel)}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            <span>{item.views}</span>
                          </div>
                          <div className="flex items-center">
                            <BarChart3 size={12} className="mr-1" />
                            <span>{item.pointsValue || 0} XP</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(item)}>
                            <Edit size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDuplicate(item.id)}>
                            <Copy size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => handleDelete(item.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <CreateContentModal 
        isOpen={isCreateContentOpen} 
        onClose={() => {
          setIsCreateContentOpen(false);
          setEditingContent(null);
        }}
        editItem={editingContent}
      />
    </MainLayout>
  );
};

export default ContentCreatorDashboard;
