
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Maximize2, 
  X, 
  AlignLeft,
  Settings,
  Eye,
} from 'lucide-react';

// Import our refactored components
import { CreatePostDialogProps } from './types';
import WriteTab from './WriteTab';
import SettingsTab from './SettingsTab';
import PreviewTab from './PreviewTab';
import PollDialog from './PollDialog';
import FileAttachDialog from './FileAttachDialog';
import EditorToolbar from './EditorToolbar';
import { usePostCreation, spaces, storeItems, premiumGroups, popularTags } from './hooks/usePostCreation';

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ open, onOpenChange }) => {
  // Use our custom hook
  const postCreation = usePostCreation(() => onOpenChange(false));
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className={`bg-gray-900 text-white border-gray-800 p-0 ${postCreation.isFullscreen ? 'w-screen h-screen max-w-none rounded-none' : 'sm:max-w-[700px]'}`}
        >
          <DialogHeader className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <DialogTitle className="text-xl font-bold text-white">Create post</DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => postCreation.setIsFullscreen(!postCreation.isFullscreen)}
                >
                  <Maximize2 size={18} />
                </button>
                <DialogClose className="text-gray-400 hover:text-white">
                  <X size={18} />
                </DialogClose>
              </div>
            </div>
            
            <Tabs value={postCreation.currentTab} onValueChange={postCreation.setCurrentTab} className="mt-4">
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
                title={postCreation.title}
                setTitle={postCreation.setTitle}
                content={postCreation.content}
                setContent={postCreation.setContent}
                selectedTags={postCreation.selectedTags}
                setSelectedTags={postCreation.setSelectedTags}
                attachedFiles={postCreation.attachedFiles}
                previewUrls={postCreation.previewUrls}
                handleRemoveFile={postCreation.handleRemoveFile}
                embeds={postCreation.embeds}
                handleRemoveEmbed={postCreation.handleRemoveEmbed}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <SettingsTab
                postType={postCreation.postType}
                setPostType={postCreation.setPostType}
                visibilityOption={postCreation.visibilityOption}
                setVisibilityOption={postCreation.setVisibilityOption}
                isScheduled={postCreation.isScheduled}
                setIsScheduled={postCreation.setIsScheduled}
                scheduledDate={postCreation.scheduledDate}
                setScheduledDate={postCreation.setScheduledDate}
                scheduledTime={postCreation.scheduledTime}
                setScheduledTime={postCreation.setScheduledTime}
                calendarOpen={postCreation.calendarOpen}
                setCalendarOpen={postCreation.setCalendarOpen}
                selectedTags={postCreation.selectedTags}
                setSelectedTags={postCreation.setSelectedTags}
                popularTags={popularTags}
                advancedEditorEnabled={postCreation.advancedEditorEnabled}
                setAdvancedEditorEnabled={postCreation.setAdvancedEditorEnabled}
                monetizeWithPoints={postCreation.monetizeWithPoints}
                setMonetizeWithPoints={postCreation.setMonetizeWithPoints}
                pointsAmount={postCreation.pointsAmount}
                setPointsAmount={postCreation.setPointsAmount}
                linkToStoreItem={postCreation.linkToStoreItem}
                setLinkToStoreItem={postCreation.setLinkToStoreItem}
                linkToPremiumGroup={postCreation.linkToPremiumGroup}
                setLinkToPremiumGroup={postCreation.setLinkToPremiumGroup}
                storeItems={storeItems}
                premiumGroups={premiumGroups}
                formatText={postCreation.formatText}
                getEstimatedReach={postCreation.getEstimatedReach}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <PreviewTab
                title={postCreation.title}
                content={postCreation.content}
                postType={postCreation.postType}
                visibilityOption={postCreation.visibilityOption}
                selectedSpace={postCreation.selectedSpace}
                spaces={spaces}
                selectedTags={postCreation.selectedTags}
                attachedFiles={postCreation.attachedFiles}
                previewUrls={postCreation.previewUrls}
                embeds={postCreation.embeds}
                monetizeWithPoints={postCreation.monetizeWithPoints}
                pointsAmount={postCreation.pointsAmount}
                isScheduled={postCreation.isScheduled}
                scheduledDate={postCreation.scheduledDate}
                scheduledTime={postCreation.scheduledTime}
                getPostTypeIcon={postCreation.getPostTypeIcon}
                getVisibilityIcon={postCreation.getVisibilityIcon}
              />
            </TabsContent>
          </div>

          <EditorToolbar
            currentTab={postCreation.currentTab}
            selectedSpace={postCreation.selectedSpace}
            spaces={spaces}
            isScheduled={postCreation.isScheduled}
            formatText={postCreation.formatText}
            handleShowFileAttachDialog={() => postCreation.setShowFileAttachDialog(true)}
            handleShowPollDialog={() => postCreation.setShowPollDialog(true)}
            handlePublish={postCreation.handlePublish}
            handleSpaceChange={postCreation.setSelectedSpace}
            handleEmbedLink={postCreation.handleEmbed}
            embedUrl={postCreation.embedUrl}
            setEmbedUrl={postCreation.setEmbedUrl}
            setCurrentTab={postCreation.setCurrentTab}
          />
        </DialogContent>
      </Dialog>

      {/* Poll Dialog */}
      <PollDialog
        open={postCreation.showPollDialog}
        onOpenChange={postCreation.setShowPollDialog}
        pollQuestion={postCreation.pollQuestion}
        setPollQuestion={postCreation.setPollQuestion}
        pollOptions={postCreation.pollOptions}
        setPollOptions={postCreation.setPollOptions}
        allowSeeResults={postCreation.allowSeeResults}
        setAllowSeeResults={postCreation.setAllowSeeResults}
        setEndDate={postCreation.setEndDate}
        setSetEndDate={postCreation.setSetEndDate}
        onSavePoll={postCreation.handleSavePoll}
      />

      {/* File Attachment Dialog */}
      <FileAttachDialog
        open={postCreation.showFileAttachDialog}
        onOpenChange={postCreation.setShowFileAttachDialog}
        onFileSelect={postCreation.handleFileAttach}
        fileInputRef={postCreation.fileInputRef}
      />
    </>
  );
};

export default CreatePostDialog;
