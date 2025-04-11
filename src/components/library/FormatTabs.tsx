
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Folder, FileVideo, File, FileAudio, Image, Tag } from 'lucide-react';

interface FormatTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const FormatTabs: React.FC<FormatTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  children 
}) => {
  return (
    <Tabs 
      defaultValue="all" 
      className="mb-6" 
      value={activeTab} 
      onValueChange={onTabChange}
    >
      <div className="flex justify-between items-center mb-4">
        <TabsList className="bg-purple-100 dark:bg-slate-800">
          <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <FileText size={16} /> All Content
          </TabsTrigger>
          <TabsTrigger value="video" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <FileVideo size={16} /> Videos
          </TabsTrigger>
          <TabsTrigger value="pdf" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <File size={16} /> Documents
          </TabsTrigger>
          <TabsTrigger value="audio" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <FileAudio size={16} /> Audio
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Image size={16} /> Images
          </TabsTrigger>
          <TabsTrigger value="tags" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Tag size={16} /> Tags
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Folder size={16} /> Categories
          </TabsTrigger>
        </TabsList>
      </div>
      
      {children}
    </Tabs>
  );
};

export default FormatTabs;
