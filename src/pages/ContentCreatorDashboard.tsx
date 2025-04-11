import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { ContentItem, ContentCategory, ContentFormat, Author } from '@/types/library';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Copy, ArrowDown, ArrowUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { ContentFormatIcon } from '@/components/library/management/utils/ContentFormatIcon';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const ContentCreatorDashboard: React.FC = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [categorySortConfig, setCategorySortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  const { toast } = useToast();
  const {
    content,
    categories,
    addContent,
    updateContent,
    deleteContent,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useLibraryContent();

  const categorySchema = z.object({
    name: z.string().min(2, {
      message: "Category name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    icon: z.string().optional(),
  })

  const categoryForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  })

  const contentSchema = z.object({
    title: z.string().min(2, {
      message: "Content title must be at least 2 characters.",
    }),
    description: z.string().optional(),
    format: z.string().min(1, {
      message: "Content format must be selected.",
    }),
    accessLevel: z.string().min(1, {
      message: "Access level must be selected.",
    }),
    duration: z.number().optional(),
    author: z.string().optional(),
    thumbnail: z.string().optional(),
    resourceUrl: z.string().optional(),
    categoryId: z.string().optional(),
    tags: z.string().optional(),
  })

  const contentForm = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      description: "",
      format: "",
      accessLevel: "",
      duration: 0,
      author: "",
      thumbnail: "",
      resourceUrl: "",
      categoryId: "",
      tags: "",
    },
  })

  const handleCategorySubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      if (selectedCategory) {
        updateCategory({ ...selectedCategory, ...values });
        toast({
          title: "Category updated successfully.",
        })
      } else {
        addCategory({ 
          id: uuidv4(), 
          itemCount: 0, 
          name: values.name || 'New Category',
          description: values.description || '',
          icon: values.icon
        });
        toast({
          title: "Category created successfully.",
        })
      }
      closeCategoryDrawer();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to save category. Please try again.",
      })
    }
  }

  const handleContentSubmit = async (values: z.infer<typeof contentSchema>) => {
    try {
      if (selectedContent) {
        const tags = typeof values.tags === 'string' ? values.tags.split(',').map(tag => tag.trim()) : values.tags || [];
        updateContent({ 
          ...selectedContent, 
          ...values,
          format: values.format as ContentFormat,
          accessLevel: values.accessLevel as 'free' | 'premium' | 'unlockable',
          tags: tags 
        });
        toast({
          title: "Content updated successfully.",
        })
      } else {
        const tags = typeof values.tags === 'string' ? values.tags.split(',').map(tag => tag.trim()) : [];
        addContent({
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          featured: false,
          pointsEnabled: false,
          pointsValue: 100,
          tags: tags,
          duration: values.duration || 0,
          author: typeof values.author === 'string' ? values.author : JSON.stringify(values.author),
          thumbnail: values.thumbnail || '/placeholder.svg',
          format: values.format as ContentFormat,
          accessLevel: values.accessLevel as 'free' | 'premium' | 'unlockable',
          title: values.title,
          description: values.description || '',
          resourceUrl: values.resourceUrl,
          categoryId: values.categoryId
        });
        toast({
          title: "Content created successfully.",
        })
      }
      closeContentDrawer();
    } catch (error) {
      console.error("Error submitting content:", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to save content. Please try again.",
      })
    }
  }

  const toggleFeatured = (id: string) => {
    const contentToUpdate = content.find(c => c.id === id);
    if (contentToUpdate) {
      updateContent({ ...contentToUpdate, featured: !contentToUpdate.featured });
      toast({
        title: "Content updated successfully.",
      })
    }
  };

  const togglePointsEnabled = (id: string) => {
    const contentToUpdate = content.find(c => c.id === id);
    if (contentToUpdate) {
      updateContent({ ...contentToUpdate, pointsEnabled: !contentToUpdate.pointsEnabled });
      toast({
        title: "Content updated successfully.",
      })
    }
  };

  const handleContentDelete = (id: string) => {
    deleteContent(id);
    toast({
      title: "Content deleted successfully.",
    })
  };

  const handleCategoryDelete = (id: string) => {
    deleteCategory(id);
    toast({
      title: "Category deleted successfully.",
    })
  };

  const handleContentClone = (item: ContentItem) => {
    const clonedItem = { ...item, id: uuidv4(), title: `${item.title} (Clone)` };
    addContent(clonedItem);
    toast({
      title: "Content cloned successfully.",
    })
  };

  const handleCategoryClone = (item: ContentCategory) => {
    const clonedItem = { ...item, id: uuidv4(), name: `${item.name} (Clone)` };
    addCategory(clonedItem);
    toast({
      title: "Category cloned successfully.",
    })
  };

  const handleContentEdit = (item: ContentItem) => {
    setSelectedContent(item);
    contentForm.reset({
      title: item.title,
      description: item.description,
      format: item.format,
      accessLevel: item.accessLevel,
      duration: item.duration,
      author: item.author,
      thumbnail: item.thumbnail,
      resourceUrl: item.resourceUrl,
      categoryId: item.categoryId,
      tags: item.tags.join(','),
    });
    openContentDrawer();
  };

  const handleCategoryEdit = (item: ContentCategory) => {
    setSelectedCategory(item);
    categoryForm.reset({
      name: item.name,
      description: item.description,
      icon: item.icon,
    });
    openCategoryDrawer();
  };

  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : 'N/A';
  };

  const sortedContent = React.useMemo(() => {
    let sortableItems = [...content];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [content, sortConfig]);

  const sortedCategories = React.useMemo(() => {
    let sortableItems = [...categories];
    if (categorySortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a.name < b.name) {
          return categorySortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a.name > b.name) {
          return categorySortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [categories, categorySortConfig]);

  const requestSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }

  const requestCategorySort = (key: string) => {
    let direction = 'asc';
    if (categorySortConfig && categorySortConfig.key === key && categorySortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setCategorySortConfig({ key, direction });
  }

  const renderSortArrow = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />;
  }

  const renderCategorySortArrow = (key: string) => {
    if (!categorySortConfig || categorySortConfig.key !== key) {
      return null;
    }
    return categorySortConfig.direction === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />;
  }

  const openContentModal = () => {
    setSelectedContent(null);
    setIsContentModalOpen(true);
  };

  const closeContentModal = () => {
    setIsContentModalOpen(false);
    setSelectedContent(null);
  };

  const openCategoryModal = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  const openContentDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeContentDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedContent(null);
    contentForm.reset();
  };

  const openCategoryDrawer = () => {
    setIsCategoryDrawerOpen(true);
  };

  const closeCategoryDrawer = () => {
    setIsCategoryDrawerOpen(false);
    setSelectedCategory(null);
    categoryForm.reset();
  };

  return (
    <MainLayout title="Content Creator Dashboard">
      <div className="container mx-auto py-10">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Content Management</h1>
          <Button onClick={openContentDrawer}><Plus className="w-4 h-4 mr-2" /> Add Content</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Content List</h2>
            </div>
            <ScrollArea className="h-[500px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Type</TableHead>
                    <TableHead onClick={() => requestSort('title')} className="cursor-pointer">
                      Title {renderSortArrow('title')}
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedContent.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell><ContentFormatIcon format={content.format} /></TableCell>
                      <TableCell>{content.title}</TableCell>
                      <TableCell>{content.categoryId ? getCategoryName(content.categoryId) : 'N/A'}</TableCell>
                      <TableCell>{content.accessLevel}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={content.featured} 
                          onCheckedChange={() => toggleFeatured(content.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleContentEdit(content)}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleContentClone(content)}>
                              <Copy className="w-4 h-4 mr-2" /> Clone
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem>
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this content from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleContentDelete(content.id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Category List</h2>
              <Button onClick={openCategoryDrawer}><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
            </div>
            <ScrollArea className="h-[500px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => requestCategorySort('name')} className="cursor-pointer">
                      Name {renderCategorySortArrow('name')}
                    </TableHead>
                    <TableHead>Item Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.itemCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleCategoryEdit(category)}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCategoryClone(category)}>
                              <Copy className="w-4 h-4 mr-2" /> Clone
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem>
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this category from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleCategoryDelete(category.id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button>Open</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedContent ? 'Edit Content' : 'Create Content'}</DrawerTitle>
            <DrawerDescription>
              {selectedContent ? 'Edit the content details here.' : 'Create new content by filling out the form below.'}
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[500px] w-full rounded-md">
            <div className="p-4">
              <Form {...contentForm}>
                <form onSubmit={contentForm.handleSubmit(handleContentSubmit)} className="space-y-4">
                  <FormField
                    control={contentForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Content Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Content Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentForm.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="course">Course</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentForm.control}
                    name="accessLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="unlockable">Unlockable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (seconds)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Content Duration" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentForm.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Content Author" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentForm.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Content Thumbnail URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentForm.control}
                    name="resourceUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resource URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Content Resource URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contentForm.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (comma separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="Content Tags" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Submit</Button>
                </form>
              </Form>
            </div>
          </ScrollArea>
          <DrawerFooter>
            <Button variant="outline" onClick={closeContentDrawer}>Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={isCategoryDrawerOpen} onOpenChange={setIsCategoryDrawerOpen}>
        <DrawerTrigger asChild>
          <Button>Open</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedCategory ? 'Edit Category' : 'Create Category'}</DrawerTitle>
            <DrawerDescription>
              {selectedCategory ? 'Edit the category details here.' : 'Create new category by filling out the form below.'}
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[500px] w-full rounded-md">
            <div className="p-4">
              <Form {...categoryForm}>
                <form onSubmit={categoryForm.handleSubmit(handleCategorySubmit)} className="space-y-4">
                  <FormField
                    control={categoryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={categoryForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Category Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={categoryForm.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input placeholder="Category Icon" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Submit</Button>
                </form>
              </Form>
            </div>
          </ScrollArea>
          <DrawerFooter>
            <Button variant="outline" onClick={closeCategoryDrawer}>Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </MainLayout>
  );
};

export default ContentCreatorDashboard;
