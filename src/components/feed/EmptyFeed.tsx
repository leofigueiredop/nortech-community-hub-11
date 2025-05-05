import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface EmptyFeedProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

const EmptyFeed: React.FC<EmptyFeedProps> = ({ hasFilters, onClearFilters }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const translate = t as (key: string) => string;
  
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
        <Filter className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-center mb-4">
          {translate('feed.empty.noPosts')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          {translate('feed.empty.noPostsDesc')}
        </p>
        <Button 
          onClick={onClearFilters}
          variant="outline"
          className="flex gap-2"
        >
          {translate('feed.empty.clearFilters')}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-nortech-light-purple rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-center mb-4 text-nortech-dark-blue">
        {translate('feed.empty.welcome')}
      </h2>
      <p className="text-lg text-nortech-text-muted text-center mb-8">
        {translate('feed.empty.welcomeDesc')}
      </p>
      <Button 
        onClick={() => navigate('/create-post')}
        className="bg-nortech-purple hover:bg-nortech-purple/90 text-white flex gap-2"
      >
        <PlusCircle size={18} />
        {translate('feed.empty.createPost')}
      </Button>
    </div>
  );
};

export default EmptyFeed;
