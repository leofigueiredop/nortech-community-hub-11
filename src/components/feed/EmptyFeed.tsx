
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyFeed: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-nortech-light-purple rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-center mb-4 text-nortech-dark-blue">
        Welcome to your community
      </h2>
      <p className="text-lg text-nortech-text-muted text-center mb-8">
        Your feed is where you'll see new posts
      </p>
      <Button 
        onClick={() => navigate('/create-post')}
        className="bg-nortech-purple hover:bg-nortech-purple/90 text-white flex gap-2"
      >
        <PlusCircle size={18} />
        Create post
      </Button>
    </div>
  );
};

export default EmptyFeed;
