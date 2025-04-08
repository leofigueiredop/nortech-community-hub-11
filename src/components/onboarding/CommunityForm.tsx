
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

interface FormData {
  communityName: string;
  communityUrl: string;
}

const CommunityForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    communityName: '',
    communityUrl: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding/profile');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-nortech-purple rounded-lg flex items-center justify-center">
            <span className="text-white text-4xl font-bold">C</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Now let's create your community</h2>
        <p className="text-center text-muted-foreground mb-8">
          Don't worry — you can always change this information later
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="communityName">Name your community</Label>
            <Input
              id="communityName"
              name="communityName"
              value={formData.communityName}
              onChange={handleChange}
              placeholder="Your Community Name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="communityUrl">Community URL</Label>
            <div className="flex">
              <Input
                id="communityUrl"
                name="communityUrl"
                value={formData.communityUrl}
                onChange={handleChange}
                placeholder="your-community"
                required
                className="rounded-r-none"
              />
              <div className="inline-flex items-center justify-center rounded-r-md border border-l-0 border-input bg-background px-3 text-sm text-muted-foreground">
                .circle.so
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-nortech-purple hover:bg-nortech-purple/90">
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommunityForm;
