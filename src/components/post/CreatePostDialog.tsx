import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Image, 
  Code, 
  FileVideo, 
  BarChart3, 
  Link, 
  Smile, 
  PlusCircle, 
  X, 
  Maximize2, 
  SquareCode, 
  Quote, 
  Minus, 
  AtSign,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from '@/api/ApiClient';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types/post';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Space {
  id: string;
  name: string;
  description?: string;
}

const TextFormatButton = ({ 
  icon: Icon, 
  tooltip, 
  onClick 
}: { 
  icon: React.ElementType; 
  tooltip: string; 
  onClick: () => void; 
}) => (
  <Button 
    variant="ghost" 
    className="rounded-full h-10 w-10 p-0" 
    title={tooltip}
    onClick={onClick}
  >
    <Icon className="h-5 w-5 text-gray-400" />
  </Button>
);

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ open, onOpenChange }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [showFileAttachDialog, setShowFileAttachDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, community } = useAuth();

  // Load spaces when dialog opens
  useEffect(() => {
    if (open && community) {
      loadSpaces();
    }
  }, [open, community]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setTitle('');
      setContent('');
      setSelectedSpace('');
    }
  }, [open]);

  // Load spaces from predefined categories
  const loadSpaces = async () => {
    if (!community) return;
    
    try {
      setLoadingSpaces(true);
      
      // Define spaces based on categories (Free, Premium, Mentor)
      const predefinedSpaces: Space[] = [
        { id: 'general-discussion', name: 'General Discussion', description: 'General community discussions' },
        { id: 'free-group', name: 'Free Group', description: 'Free community group' },
        { id: 'premium-group', name: 'Premium Group', description: 'Premium members group' },
        { id: 'mentorship-circle', name: 'Mentorship Circle', description: 'Mentorship and guidance' },
        { id: 'announcements', name: 'Announcements', description: 'Important announcements' }
      ];
      
      setSpaces(predefinedSpaces);
      
      // Select the first space by default
      const firstSpace = predefinedSpaces[0];
      if (firstSpace) {
        setSelectedSpace(firstSpace.id);
      }
    } catch (err) {
      console.error('Error loading spaces:', err);
      toast({
        title: "Error Loading Spaces",
        description: "Could not load spaces.",
        variant: "destructive"
      });
    } finally {
      setLoadingSpaces(false);
    }
  };

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['']);
  const [allowSeeResults, setAllowSeeResults] = useState(true);
  const [setEndDate, setSetEndDate] = useState(false);

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSavePoll = () => {
    // Logic to save poll and add it to the post content
    setContent(content + `\n\n[POLL: ${pollQuestion}]\n`);
    setShowPollDialog(false);
    toast({
      title: "Poll Added",
      description: "Your poll has been added to the post.",
    });
  };

  const handleFileAttach = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Logic to handle attached files
      setShowFileAttachDialog(false);
      toast({
        title: "File Attached",
        description: `${files.length} file(s) attached to your post.`,
      });
    }
  };

  const handlePublish = async () => {
    if (!selectedSpace) {
      toast({
        title: "Space Required",
        description: "Please select a space to post in.",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please write something before publishing.",
        variant: "destructive"
      });
      return;
    }

    if (!user || !community) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to publish a post.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsPublishing(true);

      // Create post using direct Supabase query
      const { data, error } = await api.supabase
        .from('posts')
        .insert({
          content: title.trim() ? `${title.trim()}\n\n${content.trim()}` : content.trim(),
          author_id: user.id,
          community_id: community.id,
          visibility: 'public'
        })
        .select();
        
      if (error) throw error;

      toast({
        title: "Post Published",
        description: "Your post has been published successfully.",
      });
      
      // Close the dialog and reset form
      onOpenChange(false);
      setTitle('');
      setContent('');
      setSelectedSpace('');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Publication Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const formatText = (format: string) => {
    // Simple text formatting logic
    switch (format) {
      case 'bold':
        setContent(content + ' **bold text** ');
        break;
      case 'italic':
        setContent(content + ' *italic text* ');
        break;
      case 'list':
        setContent(content + '\n• List item\n• List item\n• List item\n');
        break;
      case 'ordered-list':
        setContent(content + '\n1. First item\n2. Second item\n3. Third item\n');
        break;
      case 'quote':
        setContent(content + '\n> Blockquote text\n');
        break;
      case 'divider':
        setContent(content + '\n---\n');
        break;
      case 'code':
        setContent(content + '\n```\ncode block\n```\n');
        break;
      case 'mention':
        setContent(content + ' @mention ');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className={`bg-gray-900 text-white border-gray-800 p-0 ${isFullscreen ? 'w-screen h-screen max-w-none rounded-none' : 'sm:max-w-[700px]'}`}
        >
          <DialogHeader className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-white">Create post</DialogTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize2 size={18} />
                </Button>
                <DialogClose className="text-gray-400 hover:text-white">
                  <X size={18} />
                </DialogClose>
              </div>
            </div>
          </DialogHeader>

          <div className="p-0">
            <Input
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 bg-transparent text-xl font-semibold text-white placeholder:text-gray-500 focus-visible:ring-0 p-4"
            />
            
            <Textarea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[300px] border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 p-4 resize-none"
            />
          </div>

          <div className="flex justify-between items-center p-4 border-t border-gray-800">
            <div className="flex items-center">
              <TextFormatButton icon={PlusCircle} tooltip="Add" onClick={() => {}} />
              <TextFormatButton icon={Bold} tooltip="Bold" onClick={() => formatText('bold')} />
              <TextFormatButton icon={Italic} tooltip="Italic" onClick={() => formatText('italic')} />
              <TextFormatButton icon={Link} tooltip="Link" onClick={() => {}} />
              <TextFormatButton icon={Image} tooltip="Image" onClick={() => setShowFileAttachDialog(true)} />
              <TextFormatButton icon={FileVideo} tooltip="Video" onClick={() => {}} />
              <TextFormatButton icon={BarChart3} tooltip="Poll" onClick={() => setShowPollDialog(true)} />
              <TextFormatButton icon={Smile} tooltip="Emoji" onClick={() => {}} />
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white min-w-[200px]">
                  <SelectValue placeholder={loadingSpaces ? "Loading spaces..." : "Choose a space to post in"} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {spaces.map((space) => (
                    <SelectItem 
                      key={space.id} 
                      value={space.id}
                      className="hover:bg-gray-700 pl-4"
                    >
                      <div className="flex items-center gap-2">
                        {space.name}
                      </div>
                    </SelectItem>
                  ))}
                  
                  {spaces.length === 0 && !loadingSpaces && (
                    <div className="px-2 py-1 text-sm text-gray-400">
                      No spaces found
                    </div>
                  )}
                </SelectContent>
              </Select>

              <Button 
                variant="default" 
                className="w-full md:w-auto" 
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Poll Dialog */}
      <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Insert a poll</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium mb-2">Ask a question</h3>
              <Input
                placeholder="Type your question here"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-2">Options</h3>
              {pollOptions.map((option, index) => (
                <Input
                  key={index}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handlePollOptionChange(index, e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white mb-2"
                />
              ))}
              
              <Button 
                variant="outline" 
                className="border-dashed border-gray-600 text-gray-400 w-full mt-2"
                onClick={handleAddPollOption}
              >
                <PlusCircle size={16} className="mr-2" /> Add option
              </Button>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-2">Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="allow-results" 
                    checked={allowSeeResults}
                    onCheckedChange={(checked) => setAllowSeeResults(checked as boolean)} 
                  />
                  <label htmlFor="allow-results" className="text-sm">
                    Allow members to see results
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="end-date" 
                    checked={setEndDate}
                    onCheckedChange={(checked) => setSetEndDate(checked as boolean)} 
                  />
                  <label htmlFor="end-date" className="text-sm">
                    Set an end date
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-300"
              onClick={() => setShowPollDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-nortech-purple hover:bg-nortech-purple/90"
              onClick={handleSavePoll}
              disabled={!pollQuestion || pollOptions.some(opt => !opt.trim())}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Attachment Dialog */}
      <Dialog open={showFileAttachDialog} onOpenChange={setShowFileAttachDialog}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Attach files</DialogTitle>
          </DialogHeader>
          
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
                <Image size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-300">Drop your files here to attach them</p>
              
              <Button 
                variant="outline" 
                className="mt-2 border-gray-700"
                onClick={handleFileAttach}
              >
                Choose file
              </Button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                onChange={handleFileSelected}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePostDialog;
