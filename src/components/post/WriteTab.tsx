
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, FileText } from 'lucide-react';

interface WriteTabProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  attachedFiles: File[];
  previewUrls: string[];
  handleRemoveFile: (index: number) => void;
  embeds: Array<{type: string, url: string}>;
  handleRemoveEmbed: (index: number) => void;
}

const WriteTab: React.FC<WriteTabProps> = ({
  title,
  setTitle,
  content,
  setContent,
  selectedTags,
  setSelectedTags,
  attachedFiles,
  previewUrls,
  handleRemoveFile,
  embeds,
  handleRemoveEmbed
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto resize textarea (optional enhancement)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border-0 bg-transparent text-xl font-semibold text-white placeholder:text-gray-500 focus-visible:ring-0"
      />
      
      <Textarea
        ref={textareaRef}
        placeholder="Write something..."
        value={content}
        onChange={handleTextareaChange}
        className="w-full min-h-[240px] border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 resize-none"
      />
      
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-200">
              #{tag}
              <button
                onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
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
                    <div className="text-red-500 mr-2">YT</div>
                  ) : embed.type === 'loom' ? (
                    <div className="text-green-500 mr-2">LM</div>
                  ) : (
                    <div className="text-blue-400 mr-2">URL</div>
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
};

export default WriteTab;
