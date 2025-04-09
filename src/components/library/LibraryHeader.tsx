
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import UpsellBlock from '@/components/library/UpsellBlock';

interface LibraryHeaderProps {
  premiumContentCount: number;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({ premiumContentCount }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Library</h1>
        <Button asChild>
          <Link to="/library/manage" className="flex items-center gap-2">
            <Upload size={16} />
            Manage Content
          </Link>
        </Button>
      </div>
      
      <div className="mb-6">
        <UpsellBlock premiumContentCount={premiumContentCount} purchaseType="both" />
      </div>
    </>
  );
};

export default LibraryHeader;
