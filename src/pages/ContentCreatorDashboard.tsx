
import React, { useState } from 'react';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MoreVerticalIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContentItem } from '@/types/library';
import { useToast } from '@/hooks/use-toast';
import CreateContentModal from '@/components/library/CreateContentModal';

const ContentCreatorDashboard = () => {
  const { content, updateContent, deleteContent } = useLibraryContent();
  const [search, setSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  // Filter content based on search and format
  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesFormat = formatFilter === 'all' || item.format === formatFilter;
    return matchesSearch && matchesFormat;
  });

  const handleTopTenToggle = (item: ContentItem) => {
    updateContent({
      ...item,
      isTopTen: !item.isTopTen,
    });
    
    toast({
      title: item.isTopTen ? "Removed from Top 10" : "Added to Top 10",
      description: `"${item.title}" has been ${item.isTopTen ? "removed from" : "added to"} the Top 10 section.`
    });
  };

  const handleFeaturedToggle = (item: ContentItem) => {
    updateContent({
      ...item,
      featured: !item.featured,
    });
    
    toast({
      title: item.featured ? "Removed from Featured" : "Added to Featured",
      description: `"${item.title}" has been ${item.featured ? "removed from" : "added to"} the Featured section.`
    });
  };

  const handleEdit = (item: ContentItem) => {
    setEditItem(item);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (item: ContentItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      deleteContent(item.id);
      
      toast({
        title: "Content deleted",
        description: `"${item.title}" has been removed from your library.`
      });
    }
  };

  const handleDuplicate = (item: ContentItem) => {
    const duplicate = {
      ...item,
      id: `${item.id}-copy-${Date.now()}`,
      title: `${item.title} (Copy)`,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // You'd typically call an API to create the duplicate
    // For this mockup, we'll use the existing content management function
    updateContent(duplicate);
    
    toast({
      title: "Content duplicated",
      description: `"${item.title}" has been duplicated.`
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content Manager</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Add New Content</Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-56">
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="course">Course</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="bg-white rounded-md shadow">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="text-center">Views</TableHead>
                  <TableHead className="text-center">Top 10</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.format}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          item.accessLevel === 'free' 
                            ? 'bg-green-100 text-green-800' 
                            : item.accessLevel === 'premium' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-amber-100 text-amber-800'
                        }
                      >
                        {item.accessLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{item.views}</TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={item.isTopTen || false} 
                        onCheckedChange={() => handleTopTenToggle(item)} 
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={item.featured || false} 
                        onCheckedChange={() => handleFeaturedToggle(item)} 
                      />
                    </TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVerticalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(item)}>
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredContent.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      No content found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="grid" className="bg-white rounded-md shadow p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src={item.thumbnailUrl || '/placeholder.svg'} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 
                      ${item.accessLevel === 'free' 
                        ? 'bg-green-100 text-green-800' 
                        : item.accessLevel === 'premium' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`
                    }
                  >
                    {item.accessLevel}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.views} views · {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-4">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1">Top 10</span>
                        <Switch 
                          checked={item.isTopTen || false} 
                          onCheckedChange={() => handleTopTenToggle(item)}
                          size="sm"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1">Featured</span>
                        <Switch 
                          checked={item.featured || false} 
                          onCheckedChange={() => handleFeaturedToggle(item)}
                          size="sm"
                        />
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVerticalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(item)}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredContent.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No content found. Try adjusting your search or filters.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {isCreateModalOpen && (
        <CreateContentModal 
          isOpen={isCreateModalOpen} 
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditItem(null);
          }}
        />
      )}
    </div>
  );
};

export default ContentCreatorDashboard;
