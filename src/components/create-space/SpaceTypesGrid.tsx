
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import SpaceTypeCard from './SpaceTypeCard';
import { LucideIcon } from 'lucide-react';

interface SpaceType {
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
}

interface SpaceTypesGridProps {
  currentTab: string;
  spaceTypes: SpaceType[];
  onSelectType: (type: string) => void;
}

const SpaceTypesGrid: React.FC<SpaceTypesGridProps> = ({ 
  currentTab, 
  spaceTypes, 
  onSelectType 
}) => {
  const filteredSpaces = currentTab === 'all' 
    ? spaceTypes 
    : spaceTypes.filter(space => space.category === currentTab);
    
  return (
    <TabsContent value={currentTab}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpaces.map((space) => (
          <SpaceTypeCard 
            key={space.type}
            icon={space.icon}
            title={space.title}
            description={space.description}
            onClick={() => onSelectType(space.type)}
          />
        ))}
      </div>
    </TabsContent>
  );
};

export default SpaceTypesGrid;
