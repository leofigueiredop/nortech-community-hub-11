
import React, { useState, useEffect } from 'react';
import { ContentItem } from '@/types/library';
import { useContentProgress } from '@/hooks/useContentProgress';
import { usePoints } from '@/context/PointsContext';
import CourseViewerModal from './CourseViewerModal';
import MainContentViewer from './MainContentViewer';

interface ContentViewerProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const { addProgress, updateProgress, getProgress, awardPoints } = useContentProgress();
  const { awardPoints: addUserPoints } = usePoints();
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (item) {
      setHasAccess(item.accessLevel === 'free');
      addProgress(item.id);
    }
  }, [item, addProgress]);

  if (!item) return null;

  const progress = getProgress(item.id)?.progress || 0;
  const isCompleted = progress >= 100;

  // Render different viewer based on content format
  if (item.format === 'course') {
    return <CourseViewerModal item={item} onClose={onClose} />;
  }

  return (
    <MainContentViewer
      item={item}
      progress={progress}
      isCompleted={isCompleted}
      hasAccess={hasAccess}
      onClose={onClose}
      onContentView={() => setViewStartTime(Date.now())}
      handleAccess={() => setHasAccess(true)}
    />
  );
};

export default ContentViewer;
