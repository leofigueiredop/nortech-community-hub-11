
import React from 'react';

interface CategoriesSectionProps {
  allTags: string[];
  setTagFilter: (tag: string) => void;
  setActiveTab: (value: string) => void;
  content: any[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  allTags, 
  setTagFilter, 
  setActiveTab,
  content
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {allTags.map(tag => (
        <div 
          key={tag} 
          className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
          onClick={() => {
            setTagFilter(tag);
            setActiveTab('all');
          }}
        >
          <h3 className="font-medium text-lg mb-1">{tag}</h3>
          <p className="text-sm text-muted-foreground">
            {content.filter(item => item.tags.includes(tag)).length} items
          </p>
        </div>
      ))}
    </div>
  );
};

export default CategoriesSection;
