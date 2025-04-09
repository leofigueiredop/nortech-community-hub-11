
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Clock, Eye } from 'lucide-react';
import { useContentProgress } from '@/hooks/useContentProgress';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { ContentFormatIcon } from '../library/management/utils/ContentFormatIcon';

const ContentProgress: React.FC = () => {
  const { getCompletedContent, getInProgressContent } = useContentProgress();
  const { content } = useLibraryContent();
  
  const completedItems = getCompletedContent().map(progressItem => {
    const contentItem = content.find(item => item.id === progressItem.contentId);
    return { progress: progressItem, content: contentItem };
  }).filter(item => item.content); // Filter out any items that don't exist in content
  
  const inProgressItems = getInProgressContent().map(progressItem => {
    const contentItem = content.find(item => item.id === progressItem.contentId);
    return { progress: progressItem, content: contentItem };
  }).filter(item => item.content); // Filter out any items that don't exist in content
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="in-progress">
          <TabsList className="mb-4">
            <TabsTrigger value="in-progress" className="flex items-center gap-1">
              <Clock size={14} /> In Progress
              {inProgressItems.length > 0 && <Badge variant="secondary" className="ml-1">{inProgressItems.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-1">
              <CheckCircle2 size={14} /> Completed
              {completedItems.length > 0 && <Badge variant="secondary" className="ml-1">{completedItems.length}</Badge>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="in-progress">
            {inProgressItems.length > 0 ? (
              <div className="space-y-4">
                {inProgressItems.map(({ progress, content }) => content && (
                  <div key={progress.contentId} className="border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                          <ContentFormatIcon format={content.format} />
                        </div>
                        <div>
                          <h4 className="font-medium">{content.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Last viewed {formatDistanceToNow(new Date(progress.lastInteractedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {content.format.charAt(0).toUpperCase() + content.format.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{progress.progress}%</span>
                      </div>
                      <Progress value={progress.progress} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>You have no content in progress.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedItems.length > 0 ? (
              <div className="space-y-4">
                {completedItems.map(({ progress, content }) => content && (
                  <div key={progress.contentId} className="border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                          <ContentFormatIcon format={content.format} />
                        </div>
                        <div>
                          <h4 className="font-medium">{content.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Completed {formatDistanceToNow(new Date(progress.lastInteractedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-xs">
                          {content.format.charAt(0).toUpperCase() + content.format.slice(1)}
                        </Badge>
                        {content.pointsEnabled && progress.pointsAwarded && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-300 text-xs">
                            +{content.pointsValue} points
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>You haven't completed any content yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentProgress;
