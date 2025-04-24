
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { motion } from 'framer-motion';
import { FileVideo, FileText, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContentGrid from './ContentGrid';

interface CategoryOption {
  label: string;
  icon: React.ReactNode;
  filter: (item: ContentItem) => boolean;
}

interface LibraryCategoriesProps {
  content: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const LibraryCategories: React.FC<LibraryCategoriesProps> = ({
  content,
  onItemSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: CategoryOption[] = [
    {
      label: 'Courses',
      icon: <BookOpen className="h-8 w-8" />,
      filter: (item) => item.format === 'course'
    },
    {
      label: 'PDFs',
      icon: <FileText className="h-8 w-8" />,
      filter: (item) => ['pdf', 'text', 'gdoc'].includes(item.format)
    },
    {
      label: 'Videos',
      icon: <FileVideo className="h-8 w-8" />,
      filter: (item) => ['video', 'youtube', 'vimeo'].includes(item.format)
    }
  ];

  const filteredContent = selectedCategory 
    ? content.filter(categories.find(cat => cat.label === selectedCategory)?.filter)
    : [];

  return (
    <div className="space-y-8">
      {/* Category Icons */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {categories.map((category) => (
          <Button
            key={category.label}
            variant={selectedCategory === category.label ? "default" : "outline"}
            className="flex flex-col items-center gap-2 p-6 h-auto hover:scale-105 transition-transform"
            onClick={() => setSelectedCategory(category.label)}
          >
            {category.icon}
            <span className="text-sm font-medium">{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Category Content */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{selectedCategory}</h2>
            <Button
              variant="ghost"
              onClick={() => setSelectedCategory(null)}
            >
              ← Back to Categories
            </Button>
          </div>

          {/* Premium CTA if not subscribed */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white mb-8">
            <h3 className="text-xl font-semibold mb-2">Unlock Premium Content</h3>
            <p className="mb-4 text-white/90">Get unlimited access to all premium content and exclusive features.</p>
            <Button variant="secondary" className="bg-white text-purple-500 hover:bg-white/90">
              Upgrade to Premium
            </Button>
          </div>

          {/* Content Grid */}
          <ContentGrid items={filteredContent} onItemSelect={onItemSelect} />
        </motion.div>
      )}
    </div>
  );
};

export default LibraryCategories;
