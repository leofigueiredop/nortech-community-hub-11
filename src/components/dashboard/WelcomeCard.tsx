
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings, PenLine, Image } from 'lucide-react';

const WelcomeCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-gradient-to-r from-nortech-purple to-purple-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to Nortech Communities</CardTitle>
        <CardDescription className="text-gray-200">
          Your all-in-one platform for community building, education, and engagement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-6">
          Follow the setup guide to complete your community configuration. You can customize your branding, 
          invite members, create content, and more.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => navigate('/settings/branding')}
            variant="outline" 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center gap-2"
          >
            <Image size={16} />
            Customize Branding
          </Button>
          <Button 
            onClick={() => navigate('/create-post')}
            className="bg-white text-nortech-purple hover:bg-white/90 flex items-center gap-2"
          >
            <PenLine size={16} />
            Create First Post
          </Button>
          <Button 
            onClick={() => navigate('/settings')}
            variant="outline" 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center gap-2"
          >
            <Settings size={16} />
            All Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
