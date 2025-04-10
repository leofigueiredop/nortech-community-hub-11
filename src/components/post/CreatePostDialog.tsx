
import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Maximize2, 
  X, 
  FileText, 
  Calendar, 
  MessageSquare, 
  FileVideo, 
  DollarSign,
  Eye,
  Lock,
  Layers,
  AlignLeft,
  Settings,
} from 'lucide-react';

// Import our refactored components
import { CreatePostDialogProps } from './types';
import WriteTab from './WriteTab';
import SettingsTab from './SettingsTab';
import PreviewTab from './PreviewTab';
import PollDialog from './PollDialog';
import FileAttachDialog from './FileAttachDialog';
import EditorToolbar from './EditorToolbar';

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
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize2 size={18} />
                </button>
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
            <TabsContent value="write" className="mt-0">
              <WriteTab
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                attachedFiles={attachedFiles}
                previewUrls={previewUrls}
                handleRemoveFile={handleRemoveFile}
                embeds={embeds}
                handleRemoveEmbed={handleRemoveEmbed}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <SettingsTab
                postType={postType}
                setPostType={setPostType}
                visibilityOption={visibilityOption}
                setVisibilityOption={setVisibilityOption}
                isScheduled={isScheduled}
                setIsScheduled={setIsScheduled}
                scheduledDate={scheduledDate}
                setScheduledDate={setScheduledDate}
                scheduledTime={scheduledTime}
                setScheduledTime={setScheduledTime}
                calendarOpen={calendarOpen}
                setCalendarOpen={setCalendarOpen}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                popularTags={popularTags}
                advancedEditorEnabled={advancedEditorEnabled}
                setAdvancedEditorEnabled={setAdvancedEditorEnabled}
                monetizeWithPoints={monetizeWithPoints}
                setMonetizeWithPoints={setMonetizeWithPoints}
                pointsAmount={pointsAmount}
                setPointsAmount={setPointsAmount}
                linkToStoreItem={linkToStoreItem}
                setLinkToStoreItem={setLinkToStoreItem}
                linkToPremiumGroup={linkToPremiumGroup}
                setLinkToPremiumGroup={setLinkToPremiumGroup}
                storeItems={storeItems}
                premiumGroups={premiumGroups}
                formatText={formatText}
                getEstimatedReach={getEstimatedReach}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <PreviewTab
                title={title}
                content={content}
                postType={postType}
                visibilityOption={visibilityOption}
                selectedSpace={selectedSpace}
                spaces={spaces}
                selectedTags={selectedTags}
                attachedFiles={attachedFiles}
                previewUrls={previewUrls}
                embeds={embeds}
                monetizeWithPoints={monetizeWithPoints}
                pointsAmount={pointsAmount}
                isScheduled={isScheduled}
                scheduledDate={scheduledDate}
                scheduledTime={scheduledTime}
                getPostTypeIcon={getPostTypeIcon}
                getVisibilityIcon={getVisibilityIcon}
              />
            </TabsContent>
          </div>

          <EditorToolbar
            currentTab={currentTab}
            selectedSpace={selectedSpace}
            spaces={spaces}
            isScheduled={isScheduled}
            formatText={formatText}
            handleShowFileAttachDialog={() => setShowFileAttachDialog(true)}
            handleShowPollDialog={() => setShowPollDialog(true)}
            handlePublish={handlePublish}
            handleSpaceChange={setSelectedSpace}
            handleEmbedLink={handleEmbed}
            embedUrl={embedUrl}
            setEmbedUrl={setEmbedUrl}
            setCurrentTab={setCurrentTab}
          />
        </DialogContent>
      </Dialog>

      {/* Poll Dialog */}
      <PollDialog
        open={showPollDialog}
        onOpenChange={setShowPollDialog}
        pollQuestion={pollQuestion}
        setPollQuestion={setPollQuestion}
        pollOptions={pollOptions}
        setPollOptions={setPollOptions}
        allowSeeResults={allowSeeResults}
        setAllowSeeResults={setAllowSeeResults}
        setEndDate={setEndDate}
        setSetEndDate={setSetEndDate}
        onSavePoll={handleSavePoll}
      />

      {/* File Attachment Dialog */}
      <FileAttachDialog
        open={showFileAttachDialog}
        onOpenChange={setShowFileAttachDialog}
        onFileSelect={handleFileAttach}
        fileInputRef={fileInputRef}
      />
    </>
  );
};

export default CreatePostDialog;
