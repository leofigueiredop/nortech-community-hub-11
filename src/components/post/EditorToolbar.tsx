
import React from 'react';
import { Button } from '@/components/ui/button';
import TextFormatButton from './TextFormatButton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PlusCircle,
  Bold,
  Italic,
  Link,
  Image,
  FileVideo,
  BarChart3,
  Smile,
  Hash,
  ExternalLink,
} from 'lucide-react';

interface EditorToolbarProps {
  currentTab: string;
  selectedSpace: string;
  spaces: Array<{id: number, name: string}>;
  isScheduled: boolean;
  formatText: (format: string) => void;
  handleShowFileAttachDialog: () => void;
  handleShowPollDialog: () => void;
  handlePublish: () => void;
  handleSpaceChange: (space: string) => void;
  handleEmbedLink: () => void;
  embedUrl: string;
  setEmbedUrl: (url: string) => void;
  setCurrentTab: (tab: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  currentTab,
  selectedSpace,
  spaces,
  isScheduled,
  formatText,
  handleShowFileAttachDialog,
  handleShowPollDialog,
  handlePublish,
  handleSpaceChange,
  handleEmbedLink,
  embedUrl,
  setEmbedUrl,
  setCurrentTab
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-t border-gray-800">
      <div className="flex items-center">
        {currentTab === 'write' && (
          <>
            <TextFormatButton icon={PlusCircle} tooltip="Add" onClick={() => {}} />
            <TextFormatButton icon={Bold} tooltip="Bold" onClick={() => formatText('bold')} />
            <TextFormatButton icon={Italic} tooltip="Italic" onClick={() => formatText('italic')} />
            <TextFormatButton icon={Link} tooltip="Link" onClick={() => {}} />
            <TextFormatButton icon={Image} tooltip="Image" onClick={handleShowFileAttachDialog} />
            <TextFormatButton icon={FileVideo} tooltip="Video" onClick={() => {}} />
            <TextFormatButton icon={BarChart3} tooltip="Poll" onClick={handleShowPollDialog} />
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
                    <Button onClick={handleEmbedLink}>Add</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Select value={selectedSpace} onValueChange={handleSpaceChange}>
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
  );
};

export default EditorToolbar;
