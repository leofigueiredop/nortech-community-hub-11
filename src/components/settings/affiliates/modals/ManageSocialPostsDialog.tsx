
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Trash2, Plus, Copy, Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ManageSocialPostsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  hasImage: boolean;
  imageUrl?: string;
}

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const samplePosts: Record<string, SocialPost[]> = {
  instagram: [
    {
      id: '1',
      platform: 'instagram',
      content: '✨ Excited to share my experience with @yourcommunity! Join through my link in bio to get exclusive access to premium content. #YourCommunity #ContentCreator #HASHTAG_THREE',
      hasImage: true,
      imageUrl: 'https://via.placeholder.com/1080x1080/9b87f5/FFFFFF?text=Instagram+Post',
    },
    {
      id: '2',
      platform: 'instagram',
      content: "🔥 Transform your skills with @yourcommunity courses! I've been a member for [TIME_PERIOD] and learned so much. Click my affiliate link in bio to join! #YourCommunity #Learning #Growth",
      hasImage: true,
      imageUrl: 'https://via.placeholder.com/1080x1080/6E59A5/FFFFFF?text=Join+Today',
    }
  ],
  twitter: [
    {
      id: '3',
      platform: 'twitter',
      content: "I've been using @yourcommunity for [TIME_PERIOD] and it's completely changed how I approach [TOPIC]. Join through my link to get started: [AFFILIATE_LINK] #YourCommunity",
      hasImage: false,
    }
  ],
  facebook: [
    {
      id: '4',
      platform: 'facebook',
      content: "Looking to level up your [SKILL]? I've been a member of Your Community for [TIME_PERIOD] and it's been incredible for my growth. Join through my affiliate link to get started on your journey: [AFFILIATE_LINK]",
      hasImage: true,
      imageUrl: 'https://via.placeholder.com/1200x630/9b87f5/FFFFFF?text=Your+Community',
    }
  ],
  linkedin: [
    {
      id: '5',
      platform: 'linkedin',
      content: "I'm excited to share a valuable resource that's helped me advance my professional skills in [INDUSTRY/FIELD]. Your Community offers comprehensive resources for [TARGET_AUDIENCE]. Through my affiliate link, you can join this thriving community: [AFFILIATE_LINK] #ProfessionalDevelopment #YourCommunity",
      hasImage: false,
    }
  ]
};

const ManageSocialPostsDialog: React.FC<ManageSocialPostsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState('instagram');
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  
  const copyPostContent = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could add toast notification here
  };

  const handleEditPost = (post: SocialPost) => {
    setEditingPost(post);
  };

  const handleSavePost = () => {
    setEditingPost(null);
    // Logic to save the post would go here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Social Media Content</DialogTitle>
          <DialogDescription>
            Manage pre-written social media posts for your affiliates
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
            <Plus size={16} /> Create New Post
          </Button>
        </div>

        <Tabs defaultValue="instagram" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            {platforms.map((platform) => (
              <TabsTrigger key={platform.value} value={platform.value}>
                {platform.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {platforms.map((platform) => (
            <TabsContent key={platform.value} value={platform.value} className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {samplePosts[platform.value]?.length > 0 ? (
                  samplePosts[platform.value].map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <div className="p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-amber-500" />
                          <span className="font-medium capitalize">{platform.label} Post</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => copyPostContent(post.content)}
                          >
                            <Copy size={14} /> Copy Text
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-4">
                          <p className="whitespace-pre-wrap">{post.content}</p>
                        </div>
                        {post.hasImage && post.imageUrl && (
                          <div className="mt-4 flex justify-center bg-gray-100 dark:bg-gray-900 p-2 rounded">
                            <img 
                              src={post.imageUrl} 
                              alt="Social media post" 
                              className="max-w-full h-auto max-h-[300px]"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <Plus size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No {platform.label} posts yet</h3>
                    <p className="text-gray-500 mb-4">
                      Create pre-written posts for your affiliates to share
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Create {platform.label} Post
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {editingPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Post</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Post Content</label>
                  <Textarea 
                    defaultValue={editingPost.content}
                    className="min-h-[150px]"
                    placeholder="Write your social media post content here..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use placeholders like [AFFILIATE_LINK], [TIME_PERIOD], etc.
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasImage"
                    defaultChecked={editingPost.hasImage}
                    className="mr-2"
                  />
                  <label htmlFor="hasImage">Include Image</label>
                </div>

                {editingPost.hasImage && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <Input 
                      defaultValue={editingPost.imageUrl}
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="mt-2 flex justify-center">
                      {editingPost.imageUrl && (
                        <img 
                          src={editingPost.imageUrl} 
                          alt="Preview" 
                          className="max-h-[150px] max-w-full"
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setEditingPost(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleSavePost}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManageSocialPostsDialog;
