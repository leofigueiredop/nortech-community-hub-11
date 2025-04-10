
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CreatePostDialog from '@/components/post/CreatePostDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Calendar, MessageSquare, FileVideo, DollarSign } from 'lucide-react';

const CreatePost: React.FC = () => {
  const [createPostOpen, setCreatePostOpen] = useState(true);

  return (
    <MainLayout title="Create Post">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Post</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-4">Share something with your community</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create a post to share updates, ask questions, or start a discussion
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-3xl mx-auto mb-6">
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-20 gap-2 border-dashed hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setCreatePostOpen(true)}
            >
              <FileText size={24} />
              <span className="text-xs">Standard Post</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-20 gap-2 border-dashed hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setCreatePostOpen(true)}
            >
              <Calendar size={24} />
              <span className="text-xs">Event</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-20 gap-2 border-dashed hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setCreatePostOpen(true)}
            >
              <MessageSquare size={24} />
              <span className="text-xs">Question/Poll</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-20 gap-2 border-dashed hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setCreatePostOpen(true)}
            >
              <FileVideo size={24} />
              <span className="text-xs">Resource</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center justify-center h-20 gap-2 border-dashed hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setCreatePostOpen(true)}
            >
              <DollarSign size={24} />
              <span className="text-xs">Paid Post</span>
            </Button>
          </div>
          
          <Button 
            className="bg-nortech-purple hover:bg-nortech-purple/90 flex items-center gap-2"
            onClick={() => setCreatePostOpen(true)}
          >
            <PlusCircle size={18} />
            Create Custom Post
          </Button>
        </div>
      </div>
      
      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
      />
    </MainLayout>
  );
};

export default CreatePost;
