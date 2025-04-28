
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCommunities } from '@/hooks/useCommunities';
import { ContentFormat, ContentFormData } from '@/types/content';

interface ContentFormProps {
  onSubmit: (data: ContentFormData) => void;
  initialValues?: Partial<ContentFormData>;
}

const ContentForm: React.FC<ContentFormProps> = ({ onSubmit, initialValues }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { communities, isLoading: isLoadingCommunities } = useCommunities();
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [url, setUrl] = useState(initialValues?.url || '');
  const [format, setFormat] = useState<ContentFormat>('video');
  const [communityId, setCommunityId] = useState(initialValues?.community_id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
      setUrl(initialValues.url || '');
      setFormat((initialValues.format as ContentFormat) || 'video');
      setCommunityId(initialValues.community_id || '');
    }
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !url?.trim() || !format || !communityId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const contentData: ContentFormData = {
        title: title,
        description: description,
        url: url,
        format: format,
        community_id: communityId
      };

      onSubmit(contentData);

      toast({
        title: "Success",
        description: "Content created successfully."
      });

      navigate('/library');
    } catch (error) {
      console.error("Error creating content:", error);
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Content</CardTitle>
        <CardDescription>Add new learning content to the community library.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              type="url"
              id="url"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="format">Format</Label>
            <Select onValueChange={(value: string) => setFormat(value as ContentFormat)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="community">Community</Label>
            {isLoadingCommunities ? (
              <div>Loading communities...</div>
            ) : (
              <Select onValueChange={(value) => setCommunityId(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a community" />
                </SelectTrigger>
                <SelectContent>
                  {communities?.map((community) => (
                    <SelectItem key={community.id} value={community.id}>
                      {community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate('/library')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Content"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentForm;
