import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileText,
  Calendar,
  MessageSquare,
  ExternalLink,
  Upload,
  Eye,
  Lock,
  Clock,
  Hash,
  DollarSign,
  Store,
  Users,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Youtube,
  Layers,
  AlignLeft,
  Settings
} from 'lucide-react';

// Mock data for spaces
const spaces = [
  { id: 1, name: 'General Discussion' },
  { id: 2, name: 'Free Group' },
  { id: 3, name: 'Premium Group' },
  { id: 4, name: 'Mentorship Circle' },
  { id: 5, name: 'Announcements' },
];

// Mock data for store items
const storeItems = [
  { id: 1, name: 'Premium Ebook - AI Strategies' },
  { id: 2, name: 'Video Course - Leadership' },
  { id: 3, name: 'Community Masterclass' },
];

// Mock data for premium groups
const premiumGroups = [
  { id: 1, name: 'VIP Members' },
  { id: 2, name: 'Inner Circle' },
  { id: 3, name: 'Tech Leaders' },
];

// Mock data for popular tags
const popularTags = [
  'Technology', 'AI', 'Leadership', 'Career', 'Development', 
  'Product', 'Design', 'Marketing', 'Strategy', 'Innovation',
  'Crypto', 'Finance', 'Startup', 'Management', 'Business'
];

const TextFormatButton = ({ 
  icon: Icon, 
  tooltip, 
  onClick,
  isActive
}: { 
  icon: React.ElementType; 
  tooltip: string; 
  onClick: () => void;
  isActive?: boolean;
}) => (
  <Button 
    variant={isActive ? "default" : "ghost"} 
    className={`rounded-full h-10 w-10 p-0 ${isActive ? 'bg-slate-600 text-white' : ''}`}
    title={tooltip}
    onClick={onClick}
  >
    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
  </Button>
);

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ open, onOpenChange }) => {
  // Basic post data
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [postType, setPostType] = useState<string>('standard');
  const [visibilityOption, setVisibilityOption] = useState<string>('free');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTab, setCurrentTab] = useState('write');
  const [advancedEditorEnabled, setAdvancedEditorEnabled] = useState(false);
  
  // File upload states
  const [showFileAttachDialog, setShowFileAttachDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Embed states
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedType, setEmbedType] = useState<string>('');
  const [embeds, setEmbeds] = useState<Array<{type: string, url: string}>>([]);
  
  // Poll states
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['']);
  const [allowSeeResults, setAllowSeeResults] = useState(true);
  const [setEndDate, setSetEndDate] = useState(false);
  
  // Tags and monetization
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [monetizeWithPoints, setMonetizeWithPoints] = useState(false);
  const [pointsAmount, setPointsAmount] = useState(100);
  const [linkToStoreItem, setLinkToStoreItem] = useState<string>('');
  const [linkToPremiumGroup, setLinkToPremiumGroup] = useState<string>('');
  
  // Scheduling
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  
  const { toast } = useToast();
  
  // Get estimated reach based on space and visibility
  const getEstimatedReach = () => {
    // This would come from analytics in a real app
    const spaceReach = {
      '1': 500, // General Discussion
      '2': 300, // Free Group
      '3': 150, // Premium Group
      '4': 75,  // Mentorship Circle
      '5': 600  // Announcements
    };
    
    const visibilityMultiplier = {
      'free': 1,
      'premium': 0.3,
      'teaser': 0.8
    };
    
    const selectedSpaceReach = selectedSpace ? spaceReach[selectedSpace as keyof typeof spaceReach] || 0 : 0;
    const multiplier = visibilityMultiplier[visibilityOption as keyof typeof visibilityMultiplier] || 1;
    
    return Math.round(selectedSpaceReach * multiplier);
  };
  
  // Update preview urls when files change
  useEffect(() => {
    if (attachedFiles.length > 0) {
      const newPreviewUrls = attachedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
      
      return () => {
        newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      };
    }
  }, [attachedFiles]);
  
  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSavePoll = () => {
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
      const filesArray = Array.from(files);
      setAttachedFiles(prev => [...prev, ...filesArray]);
      setShowFileAttachDialog(false);
      toast({
        title: "Files Attached",
        description: `${files.length} file(s) attached to your post.`,
      });
    }
  };
  
  const handleEmbed = () => {
    if (!embedUrl.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a valid URL to embed.",
        variant: "destructive"
      });
      return;
    }
    
    // Detect embed type
    let type = 'link';
    if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
      type = 'youtube';
    } else if (embedUrl.includes('loom.com')) {
      type = 'loom';
    }
    
    setEmbedType(type);
    setEmbeds([...embeds, {type, url: embedUrl}]);
    setContent(content + `\n\n[EMBED: ${embedUrl}]\n`);
    setEmbedUrl('');
    
    toast({
      title: "Link Embedded",
      description: `The ${type} link has been embedded in your post.`,
    });
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...attachedFiles];
    const newPreviewUrls = [...previewUrls];
    
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setAttachedFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };
  
  const handleRemoveEmbed = (index: number) => {
    const newEmbeds = [...embeds];
    newEmbeds.splice(index, 1);
    setEmbeds(newEmbeds);
  };

  const handlePublish = () => {
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
    
    // Gather post data for API submission
    const postData = {
      title,
      content,
      space: selectedSpace,
      postType,
      visibility: visibilityOption,
      tags: selectedTags,
      monetization: {
        usePoints: monetizeWithPoints,
        pointsAmount: monetizeWithPoints ? pointsAmount : 0,
        storeItem: linkToStoreItem || null,
        premiumGroup: linkToPremiumGroup || null
      },
      scheduling: {
        isScheduled,
        scheduledDate: isScheduled ? scheduledDate : null,
        scheduledTime: isScheduled ? scheduledTime : null
      },
      attachments: attachedFiles.map(file => file.name),
      embeds,
      poll: showPollDialog ? {
        question: pollQuestion,
        options: pollOptions,
        allowSeeResults,
        endDate: setEndDate ? "future-date" : null
      } : null
    };
    
    // In a real app, you would submit this to an API
    console.log("Publishing post:", postData);

    toast({
      title: isScheduled ? "Post Scheduled" : "Post Published",
      description: isScheduled ? "Your post has been scheduled to publish." : "Your post has been published successfully.",
    });
    
    // Close the dialog and reset form
    onOpenChange(false);
    resetForm();
  };
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedSpace('');
    setPostType('standard');
    setVisibilityOption('free');
    setSelectedTags([]);
    setAttachedFiles([]);
    setPreviewUrls([]);
    setEmbeds([]);
    setMonetizeWithPoints(false);
    setPointsAmount(100);
    setLinkToStoreItem('');
    setLinkToPremiumGroup('');
    setIsScheduled(false);
    setScheduledDate(undefined);
    setScheduledTime('12:00');
    setPollQuestion('');
    setPollOptions(['']);
  };

  const formatText = (format: string) => {
    // Text formatting logic
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
      case 'spoiler':
        setContent(content + '\n||Spoiler content||\n');
        break;
      case 'collapsible':
        setContent(content + '\n<details>\n<summary>Click to expand</summary>\nHidden content here\n</details>\n');
        break;
      default:
        break;
    }
  };
  
  // Function to determine post type icon
  const getPostTypeIcon = () => {
    switch (postType) {
      case 'standard':
        return <FileText size={18} />;
      case 'event':
        return <Calendar size={18} />;
      case 'question':
        return <MessageSquare size={18} />;
      case 'resource':
        return <FileVideo size={18} />;
      case 'paid':
        return <DollarSign size={18} />;
      default:
        return <FileText size={18} />;
    }
  };
  
  // Function to determine visibility icon
  const getVisibilityIcon = () => {
    switch (visibilityOption) {
      case 'free':
        return <Eye size={18} />;
      case 'premium':
        return <Lock size={18} />;
      case 'teaser':
        return <Layers size={18} />;
      default:
        return <Eye size={18} />;
    }
  };
  
  // Function to render the editor based on current tab
  const renderEditorContent = () => {
    switch (currentTab) {
      case 'write':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 bg-transparent text-xl font-semibold text-white placeholder:text-gray-500 focus-visible:ring-0"
            />
            
            <Textarea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[240px] border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 resize-none"
            />
            
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-200">
                    #{tag}
                    <button
                      onClick={() => setSelectedTags(tags => tags.filter(t => t !== tag))}
                      className="ml-1 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {attachedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">Attached Files</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="border border-gray-700 rounded-md overflow-hidden bg-gray-800 aspect-square">
                        {attachedFiles[index].type.includes('image') ? (
                          <img 
                            src={url} 
                            alt={`Preview ${index}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <FileText size={40} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {embeds.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">Embedded Links</h3>
                <div className="space-y-2">
                  {embeds.map((embed, index) => (
                    <div key={index} className="bg-gray-800 border border-gray-700 rounded-md p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        {embed.type === 'youtube' ? (
                          <Youtube size={18} className="text-red-500 mr-2" />
                        ) : embed.type === 'loom' ? (
                          <FileVideo size={18} className="text-green-500 mr-2" />
                        ) : (
                          <Link size={18} className="text-blue-400 mr-2" />
                        )}
                        <span className="text-sm text-gray-300 truncate max-w-[200px]">{embed.url}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveEmbed(index)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6 p-1">
            <div className="space-y-4">
              <h3 className="text-base font-medium text-white">Post Type</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Button 
                  variant={postType === 'standard' ? 'default' : 'outline'} 
                  onClick={() => setPostType('standard')}
                  className="flex flex-col items-center justify-center h-[70px] gap-1"
                >
                  <FileText size={20} />
                  <span className="text-xs">Standard</span>
                </Button>
                <Button 
                  variant={postType === 'event' ? 'default' : 'outline'} 
                  onClick={() => setPostType('event')}
                  className="flex flex-col items-center justify-center h-[70px] gap-1"
                >
                  <Calendar size={20} />
                  <span className="text-xs">Event</span>
                </Button>
                <Button 
                  variant={postType === 'question' ? 'default' : 'outline'} 
                  onClick={() => setPostType('question')}
                  className="flex flex-col items-center justify-center h-[70px] gap-1"
                >
                  <MessageSquare size={20} />
                  <span className="text-xs">Question</span>
                </Button>
                <Button 
                  variant={postType === 'resource' ? 'default' : 'outline'} 
                  onClick={() => setPostType('resource')}
                  className="flex flex-col items-center justify-center h-[70px] gap-1"
                >
                  <FileVideo size={20} />
                  <span className="text-xs">Resource</span>
                </Button>
                <Button 
                  variant={postType === 'paid' ? 'default' : 'outline'} 
                  onClick={() => setPostType('paid')}
                  className="flex flex-col items-center justify-center h-[70px] gap-1"
                >
                  <DollarSign size={20} />
                  <span className="text-xs">Paid</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-base font-medium text-white">Visibility Options</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button 
                  variant={visibilityOption === 'free' ? 'default' : 'outline'} 
                  onClick={() => setVisibilityOption('free')}
                  className="flex flex-col items-center justify-center h-[70px] gap-1"
                >
                  <Eye size={20} />
                  <span className="text-xs">Free (All)</span>
                </Button>
                <Button 
                  variant={visibilityOption === 'premium' ? 'default' : 'outline'} 
                  onClick={() => setVisibilityOption('premium')}
                  className="flex flex-col items-center justify-center h-[70px] gap-1"
                >
                  <Lock size={20} />
                  <span className="text-xs">Premium</span>
                </Button>
                <Button 
                  variant={visibilityOption === 'teaser' ? 'default' : 'outline'} 
                  onClick={() => setVisibilityOption('teaser')}
                  className="flex flex-col items-center justify-center h-[70px] gap-1"
                >
                  <Layers size={20} />
                  <span className="text-xs">Public Teaser</span>
                </Button>
                <Button 
                  variant={isScheduled ? 'default' : 'outline'} 
                  onClick={() => setIsScheduled(!isScheduled)}
                  className="flex flex-col items-center justify-center h-[70px] gap-1"
                >
                  <Clock size={20} />
                  <span className="text-xs">Scheduled</span>
                </Button>
              </div>
              
              {isScheduled && (
                <div className="space-y-3 pt-2 bg-gray-800 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-300">Schedule Publication</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                          <CalendarComponent
                            mode="single"
                            selected={scheduledDate}
                            onSelect={(date) => {
                              setScheduledDate(date);
                              setCalendarOpen(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="w-full sm:w-40">
                      <TimePicker
                        value={scheduledTime}
                        onChange={setScheduledTime}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-base font-medium text-white">Tags</h3>
              <TagsInput
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                allTags={popularTags}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-white">Advanced Editor</h3>
                <Switch 
                  checked={advancedEditorEnabled} 
                  onCheckedChange={setAdvancedEditorEnabled}
                />
              </div>
              
              {advancedEditorEnabled && (
                <div className="space-y-3 bg-gray-800 p-3 rounded-md">
                  <div className="flex items-center space-x-1">
                    <TextFormatButton icon={SquareCode} tooltip="Code/Markdown" onClick={() => formatText('code')} />
                    <TextFormatButton icon={Eye} tooltip="Spoiler Block" onClick={() => formatText('spoiler')} />
                    <TextFormatButton icon={ChevronDown} tooltip="Collapsible Section" onClick={() => formatText('collapsible')} />
                  </div>
                </div>
              )}
            </div>
            
            {(visibilityOption === 'premium' || postType === 'paid') && (
              <div className="space-y-3">
                <h3 className="text-base font-medium text-white">Monetization</h3>
                <div className="space-y-3 bg-gray-800 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-300">Allow redemption via points</h4>
                      <p className="text-xs text-gray-400">Users can spend points to access this content</p>
                    </div>
                    <Switch 
                      checked={monetizeWithPoints} 
                      onCheckedChange={setMonetizeWithPoints}
                    />
                  </div>
                  
                  {monetizeWithPoints && (
                    <div className="pt-3">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Points required ({pointsAmount})</h4>
                      <Slider
                        value={[pointsAmount]}
                        min={50}
                        max={500}
                        step={10}
                        onValueChange={(value) => setPointsAmount(value[0])}
                      />
                    </div>
                  )}
                  
                  <div className="pt-3 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Link to Store Item (Optional)</h4>
                      <Select value={linkToStoreItem} onValueChange={setLinkToStoreItem}>
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select a store item" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="">None</SelectItem>
                          {storeItems.map(item => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Link to Premium Group (Optional)</h4>
                      <Select value={linkToPremiumGroup} onValueChange={setLinkToPremiumGroup}>
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select a premium group" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="">None</SelectItem>
                          {premiumGroups.map(group => (
                            <SelectItem key={group.id} value={group.id.toString()}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <h3 className="text-base font-medium text-white">Analytics Insights</h3>
              <div className="bg-gray-800 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Estimated Reach</h4>
                    <p className="text-2xl font-bold text-white">{getEstimatedReach()}</p>
                    <p className="text-xs text-gray-400">Based on your selected space and visibility</p>
                  </div>
                  <TrendingUp size={40} className="text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'preview':
        return (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-gray-900 dark:text-gray-100">
              {title && <h2 className="text-xl font-bold mb-3">{title}</h2>}
              
              <div className="mb-3 flex items-center">
                <div className="flex items-center mr-3">
                  {getPostTypeIcon()}
                  <span className="ml-1 text-sm">{postType.charAt(0).toUpperCase() + postType.slice(1)}</span>
                </div>
                
                <div className="flex items-center">
                  {getVisibilityIcon()}
                  <span className="ml-1 text-sm">
                    {visibilityOption === 'free' ? 'Free' : 
                     visibilityOption === 'premium' ? 'Premium' : 
                     visibilityOption === 'teaser' ? 'Public Teaser' : 'Free'}
                  </span>
                </div>
                
                {selectedSpace && spaces.find(s => s.id.toString() === selectedSpace) && (
                  <Badge className="ml-3">
                    {spaces.find(s => s.id.toString() === selectedSpace)?.name}
                  </Badge>
                )}
              </div>
              
              <div className="whitespace-pre-line mb-4">
                {visibilityOption === 'teaser' ? (
                  <>
                    <p>{content.substring(0, 150)}...</p>
                    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-sm">
                      <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                        <Lock size={14} className="mr-2 flex-shrink-0" />
                        Subscribe to see the full content
                      </p>
                    </div>
                  </>
                ) : visibilityOption === 'premium' && !monetizeWithPoints ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
                    <p className="blur-sm select-none mb-2">{content}</p>
                    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-sm relative z-20">
                      <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                        <Lock size={14} className="mr-2 flex-shrink-0" />
                        This premium content is for subscribers only
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>{content}</p>
                )}
              </div>
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 mb-4">
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {attachedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      {attachedFiles[index].type.includes('image') ? (
                        <img 
                          src={url} 
                          alt={`Attachment ${index + 1}`} 
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700">
                          <FileText size={32} className="text-gray-400" />
                          <span className="ml-2 text-sm truncate max-w-[100px]">
                            {attachedFiles[index].name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {embeds.length > 0 && (
                <div className="mt-4 space-y-3">
                  {embeds.map((embed, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        {embed.type === 'youtube' ? (
                          <Youtube size={18} className="text-red-500 mr-2" />
                        ) : embed.type === 'loom' ? (
                          <FileVideo size={18} className="text-green-500 mr-2" />
                        ) : (
                          <Link size={18} className="text-blue-400 mr-2" />
                        )}
                        <a href={embed.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">
                          {embed.url}
                        </a>
                      </div>
                      
                      {embed.type === 'youtube' && (
                        <div className="bg-gray-200 dark:bg-gray-700 aspect-video flex items-center justify-center">
                          <Youtube size={48} className="text-red-500 opacity-50" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {monetizeWithPoints && (
                <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-sm">
                  <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                    <DollarSign size={14} className="mr-2 flex-shrink-0" />
                    Unlock with {pointsAmount} points
                  </p>
                </div>
              )}
              
              {isScheduled && scheduledDate && (
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={14} className="inline-block mr-1" />
                  Scheduled for {format(scheduledDate, 'PPP')} at {scheduledTime}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
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
              <div className="flex items-center">
                <DialogTitle className="text-xl font-bold text-white">Create post</DialogTitle>
                <Badge className="ml-3 bg-gray-700 text-white">
                  {spaces.find(space => space.id.toString() === selectedSpace)?.name || 'Select Space'}
                </Badge>
              </div>
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
            
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
              <TabsList className="bg-gray-800 border-gray-700">
                <TabsTrigger value="write" className="data-[state=active]:bg-gray-700">
                  <AlignLeft size={16} className="mr-2" />
                  Write
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
                  <Settings size={16} className="mr-2" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-gray-700">
                  <Eye size={16} className="mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogHeader>

          <div className="p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
            {renderEditorContent()}
          </div>

          <div className="flex justify-between items-center p-4 border-t border-gray-800">
            <div className="flex items-center">
              {currentTab === 'write' && (
                <>
                  <TextFormatButton icon={PlusCircle} tooltip="Add" onClick={() => {}} />
                  <TextFormatButton icon={Bold} tooltip="Bold" onClick={() => formatText('bold')} />
                  <TextFormatButton icon={Italic} tooltip="Italic" onClick={() => formatText('italic')} />
                  <TextFormatButton icon={Link} tooltip="Link" onClick={() => {}} />
                  <TextFormatButton icon={Image} tooltip="Image" onClick={() => setShowFileAttachDialog(true)} />
                  <TextFormatButton icon={FileVideo} tooltip="Video" onClick={() => {}} />
                  <TextFormatButton icon={BarChart3} tooltip="Poll" onClick={() => setShowPollDialog(true)} />
                  <TextFormatButton icon={Smile} tooltip="Emoji" onClick={() => {}} />
                  <TextFormatButton icon={Hash} tooltip="Tag" onClick={() => {
                    setCurrentTab('settings');
                    setTimeout(() => {
                      const tagsInput = document.querySelector('input[placeholder*="tag"]');
                      if (tagsInput) (tagsInput as HTMLInputElement).focus();
                    }, 100);
                  }} />
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-gray-800 border-gray-700">
                      <div className="space-y-2">
                        <h4 className="font-medium text-white text-sm">Embed external content</h4>
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="Enter URL (YouTube, Loom, etc.)" 
                            value={embedUrl}
                            onChange={(e) => setEmbedUrl(e.target.value)}
                            className="bg-gray-700 border-gray-600"
                          />
                          <Button onClick={handleEmbed}>Add</Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white min-w-[200px]">
                  <SelectValue placeholder="Choose a space to post in" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {spaces.map((space) => (
                    <SelectItem 
                      key={space.id} 
                      value={space.id.toString()}
                      className="hover:bg-gray-700"
                    >
                      {space.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                className="bg-nortech-purple hover:bg-nortech-purple/90 text-white"
                onClick={handlePublish}
              >
                {isScheduled ? "Schedule" : "Publish"}
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
            <DialogDescription className="text-gray-400">
              Create a poll for community engagement
            </DialogDescription>
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
          
          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Attachment Dialog */}
      <Dialog open={showFileAttachDialog} onOpenChange={setShowFileAttachDialog}>
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
          
          <DialogFooter>
            <Button onClick={() => setShowFileAttachDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePostDialog;
