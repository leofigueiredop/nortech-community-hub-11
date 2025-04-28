
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContentTextProps {
  content: string;
  onProgress?: (progress: number) => void;
}

const ContentText: React.FC<ContentTextProps> = ({ content, onProgress }) => {
  React.useEffect(() => {
    // When the component is mounted, consider the progress as 100%
    // This is useful for content that doesn't have a clear measure of progress like videos
    if (onProgress) {
      onProgress(100);
    }
  }, [onProgress]);
  
  return (
    <ScrollArea className="h-[500px] w-full p-6 bg-card">
      <div className="prose dark:prose-invert max-w-none">
        {/* Verifica se o conteúdo parece ser HTML */}
        {content.includes('<') && content.includes('>') ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <div>
            {content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ContentText;
