
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  formatText, 
  validatePost, 
  detectEmbedType, 
  getPostTypeIcon, 
  getVisibilityIcon,
  checkSensitiveContent
} from '../utils/postUtils';

interface PostData {
  title: string;
  content: string;
  space: string;
  postType: string;
  visibility: string;
  tags: string[];
  monetization: {
    usePoints: boolean;
    pointsAmount: number;
    storeItem: string | null;
    premiumGroup: string | null;
  };
  scheduling: {
    isScheduled: boolean;
    scheduledDate: Date | null;
    scheduledTime: string | null;
  };
  attachments: string[];
  embeds: Array<{type: string, url: string}>;
  poll: {
    question: string;
    options: string[];
    allowSeeResults: boolean;
    endDate: string | null;
  } | null;
}

// Mock data for spaces
export const spaces = [
  { id: 1, name: 'General Discussion' },
  { id: 2, name: 'Free Group' },
  { id: 3, name: 'Premium Group' },
  { id: 4, name: 'Mentorship Circle' },
  { id: 5, name: 'Announcements' },
];

// Mock data for store items
export const storeItems = [
  { id: 1, name: 'Premium Ebook - AI Strategies' },
  { id: 2, name: 'Video Course - Leadership' },
  { id: 3, name: 'Community Masterclass' },
];

// Mock data for premium groups
export const premiumGroups = [
  { id: 1, name: 'VIP Members' },
  { id: 2, name: 'Inner Circle' },
  { id: 3, name: 'Tech Leaders' },
];

// Mock data for popular tags
export const popularTags = [
  'Technology', 'AI', 'Leadership', 'Career', 'Development', 
  'Product', 'Design', 'Marketing', 'Strategy', 'Innovation',
  'Crypto', 'Finance', 'Startup', 'Management', 'Business'
];

export const usePostCreation = (onDialogClose: () => void) => {
  const { toast } = useToast();
  
  // Basic post data
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [postType, setPostType] = useState<string>('standard');
  const [visibilityOption, setVisibilityOption] = useState<string>('free');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTab, setCurrentTab] = useState('write');
  const [advancedEditorEnabled, setAdvancedEditorEnabled] = useState(false);
  
  // Selection tracking
  const [textSelection, setTextSelection] = useState<{ start: number, end: number }>({ start: 0, end: 0 });
  
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
  
  // Validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
  
  // Format text using the utility function
  const handleFormatText = (format: string) => {
    setContent(formatText(content, format, textSelection));
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
    
    // Use the utility function to detect embed type
    const type = detectEmbedType(embedUrl);
    
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
    // Gather post data for validation
    const postData: PostData = {
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
        scheduledDate: isScheduled ? scheduledDate || null : null,
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
    
    // Check for sensitive content
    if (checkSensitiveContent(content)) {
      toast({
        title: "Content Warning",
        description: "Your post may contain sensitive information. Please review before publishing.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate the post data
    const { valid, errors } = validatePost(postData);
    setValidationErrors(errors);
    
    if (!valid) {
      // Get the first error message to display
      const firstError = Object.values(errors)[0];
      
      toast({
        title: "Validation Error",
        description: firstError || "Please check your post for errors.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would submit this to an API
    console.log("Publishing post:", postData);

    toast({
      title: isScheduled ? "Post Scheduled" : "Post Published",
      description: isScheduled ? "Your post has been scheduled to publish." : "Your post has been published successfully.",
    });
    
    // Close the dialog and reset form
    onDialogClose();
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
    setValidationErrors({});
  };

  return {
    // Basic post data
    title,
    setTitle,
    content,
    setContent,
    selectedSpace,
    setSelectedSpace,
    postType,
    setPostType,
    visibilityOption,
    setVisibilityOption,
    isFullscreen,
    setIsFullscreen,
    currentTab,
    setCurrentTab,
    advancedEditorEnabled,
    setAdvancedEditorEnabled,
    
    // Text selection
    textSelection,
    setTextSelection,
    
    // File upload states
    showFileAttachDialog,
    setShowFileAttachDialog,
    fileInputRef,
    attachedFiles,
    previewUrls,
    
    // Embed states
    embedUrl,
    setEmbedUrl,
    embedType,
    embeds,
    
    // Poll states
    showPollDialog,
    setShowPollDialog,
    pollQuestion,
    setPollQuestion,
    pollOptions,
    setPollOptions,
    allowSeeResults,
    setAllowSeeResults,
    setEndDate,
    setSetEndDate,
    
    // Tags and monetization
    selectedTags,
    setSelectedTags,
    monetizeWithPoints,
    setMonetizeWithPoints,
    pointsAmount,
    setPointsAmount,
    linkToStoreItem,
    setLinkToStoreItem,
    linkToPremiumGroup,
    setLinkToPremiumGroup,
    
    // Scheduling
    isScheduled,
    setIsScheduled,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    calendarOpen,
    setCalendarOpen,
    
    // Validation
    validationErrors,
    
    // Methods
    getEstimatedReach,
    formatText: handleFormatText,
    getPostTypeIcon: () => getPostTypeIcon(postType),
    getVisibilityIcon: () => getVisibilityIcon(visibilityOption),
    handleSavePoll,
    handleFileAttach,
    handleFileSelected,
    handleEmbed,
    handleRemoveFile,
    handleRemoveEmbed,
    handlePublish,
  };
};
