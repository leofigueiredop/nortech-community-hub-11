
import React from 'react';
import { Check } from 'lucide-react';

const CommunityAISettings: React.FC = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg text-white">
      <div className="flex items-center justify-center mb-2">
        <span className="text-yellow-300 text-xl">✨</span>
      </div>
      
      <h2 className="text-3xl font-bold text-center mb-4">Community AI</h2>
      
      <p className="text-center text-gray-300 mb-8">
        Build and scale your community with the power of AI in Circle. 
        <a href="#" className="text-blue-400 hover:underline ml-1">Learn more</a>
      </p>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Check className="text-gray-400 mt-1" size={20} />
            <div>
              <h3 className="font-medium">Content co-pilot</h3>
              <p className="text-gray-400">helps you write, edit, and repurpose highly engaging content</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Check className="text-gray-400 mt-1" size={20} />
            <div>
              <h3 className="font-medium">Automated transcriptions</h3>
              <p className="text-gray-400">make all your videos searchable and accessible</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Check className="text-gray-400 mt-1" size={20} />
            <div>
              <h3 className="font-medium">Activity scores</h3>
              <p className="text-gray-400">help you measure and improve community engagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityAISettings;
