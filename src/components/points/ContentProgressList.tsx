
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ContentProgress } from '@/types/library';
import ContentProgressItem from './ContentProgressItem';

export interface ContentProgressListProps {
  progressItems: ContentProgress[];
  getContentTitle: (id: string) => string;
}

const ContentProgressList: React.FC<ContentProgressListProps> = ({
  progressItems,
  getContentTitle
}) => {
  // Sort by last accessed, most recent first
  const sortedItems = [...progressItems].sort((a, b) => {
    const dateA = new Date(a.last_accessed_at).getTime();
    const dateB = new Date(b.last_accessed_at).getTime();
    return dateB - dateA;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Progress</CardTitle>
        <CardDescription>Track your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You haven't started any content yet.</p>
            <Link to="/library">
              <Button variant="outline" className="mt-4">
                Browse Library
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <ContentProgressItem 
                key={item.id}
                progress={item}
                contentTitle={getContentTitle(item.content_id)}
              />
            ))}
            
            <div className="text-center mt-4">
              <Link to="/library">
                <Button variant="outline">
                  View All Content
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentProgressList;
