
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ContentGrid from '@/components/library/ContentGrid';
import Post from '@/components/post/Post';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContentItems } from '@/hooks/useContentItems';
import TagsExplorer from '@/components/tags/TagsExplorer';
import { ArrowLeft, Tag as TagIcon } from 'lucide-react';

const TagPage: React.FC = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const { content, allTags } = useContentItems();
  
  // Mock posts data since useFeedData().posts is not accessible
  const mockPosts = useMemo(() => {
    // Return some content items as posts with the matching tag
    return content
      .filter(item => item.tags && item.tags.includes(tagName || ''))
      .slice(0, 5) // Take just a few items to serve as posts
      .map(item => ({
        id: item.id,
        author: {
          name: "Community Member",
          avatar: "/placeholder.svg"
        },
        title: item.title,
        content: item.description,
        tags: item.tags,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        date: item.createdAt,
        isPinned: false,
        isLiked: false
      }));
  }, [content, tagName]);
  
  // Filter content by tag
  const taggedContent = useMemo(() => {
    return content.filter(item => 
      item.tags && item.tags.includes(tagName || '')
    );
  }, [content, tagName]);
  
  // Calculate related tags
  const relatedTags = useMemo(() => {
    // Get all tags that appear together with the current tag
    const tagsMap: Record<string, number> = {};
    
    [...taggedContent, ...mockPosts].forEach(item => {
      if (!item.tags) return;
      
      item.tags.forEach(tag => {
        if (tag !== tagName) {
          tagsMap[tag] = (tagsMap[tag] || 0) + 1;
        }
      });
    });
    
    return Object.entries(tagsMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [taggedContent, mockPosts, tagName]);
  
  // Calculate popular tags
  const popularTags = useMemo(() => {
    const tagsWithCount = allTags.map(tag => ({
      name: tag,
      count: content.filter(item => item.tags && item.tags.includes(tag)).length
    }));
    
    return tagsWithCount
      .filter(tag => tag.name !== tagName)
      .sort((a, b) => b.count - a.count);
  }, [allTags, content, tagName]);
  
  if (!tagName) {
    return <MainLayout title="Tag Not Found">Tag not found</MainLayout>;
  }
  
  return (
    <MainLayout title={`#${tagName}`}>
      <div className="mb-6">
        <Link to="/library">
          <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
            <ArrowLeft size={16} className="mr-2" />
            Back to Library
          </Button>
        </Link>
        
        <div className="flex items-center mb-6">
          <TagIcon size={20} className="mr-2 text-purple-500" />
          <h1 className="text-3xl font-bold">#{tagName}</h1>
          <Badge className="ml-3 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {taggedContent.length + mockPosts.length} items
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            {mockPosts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Posts</h2>
                <div className="space-y-4">
                  {mockPosts.slice(0, 3).map(post => (
                    <Post key={post.id} {...post} />
                  ))}
                  {mockPosts.length > 3 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" asChild>
                        <Link to={`/feed?tag=${tagName}`}>
                          View all {mockPosts.length} posts
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {taggedContent.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
                <ContentGrid 
                  items={taggedContent} 
                  onItemSelect={() => {}} 
                />
              </div>
            )}
            
            {taggedContent.length === 0 && mockPosts.length === 0 && (
              <div className="text-center py-12 border rounded-lg bg-slate-50 dark:bg-slate-900">
                <h3 className="text-lg font-medium mb-2">No content found for #{tagName}</h3>
                <p className="text-muted-foreground">Be the first to create content with this tag!</p>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            {relatedTags.length > 0 && (
              <TagsExplorer 
                tags={relatedTags} 
                title="Related Topics"
              />
            )}
            
            <TagsExplorer 
              tags={popularTags.slice(0, 10)} 
              title="Popular Topics"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TagPage;
