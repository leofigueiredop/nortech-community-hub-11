
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

interface Feature {
  id: string;
  name: string;
  checked: boolean;
}

const FeaturesForm: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([
    { id: 'discussions', name: 'Discussions', checked: true },
    { id: 'courses', name: 'Courses', checked: false },
    { id: 'events', name: 'Events', checked: true },
    { id: 'live-streams', name: 'Live streams', checked: false },
    { id: 'chat', name: 'Chat', checked: true },
    { id: 'email-marketing', name: 'Email marketing', checked: false },
    { id: 'ai-agents', name: 'AI agents', checked: false },
    { id: 'gamification', name: 'Gamification', checked: true },
    { id: 'website-builder', name: 'Website builder', checked: false },
    { id: 'branded-app', name: 'Branded app', checked: true },
    { id: 'paid-memberships', name: 'Paid memberships', checked: true },
    { id: 'developer-tools', name: 'Developer tools', checked: false },
  ]);
  
  const navigate = useNavigate();

  const toggleFeature = (id: string) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, checked: !feature.checked } : feature
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-nortech-purple rounded-lg flex items-center justify-center">
            <span className="text-white text-4xl font-bold">C</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">
          What's essential for your community?
        </h2>
        
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className="flex items-center space-x-3 border rounded-lg p-4 hover:border-nortech-purple cursor-pointer"
                onClick={() => toggleFeature(feature.id)}
              >
                <Checkbox 
                  id={feature.id} 
                  checked={feature.checked}
                  onCheckedChange={() => toggleFeature(feature.id)}
                  className="data-[state=checked]:bg-nortech-purple data-[state=checked]:border-nortech-purple"
                />
                <Label 
                  htmlFor={feature.id}
                  className="text-base font-medium cursor-pointer flex-1"
                >
                  {feature.name}
                </Label>
              </div>
            ))}
          </div>
          
          <div className="pt-8 flex justify-end">
            <Button 
              type="submit" 
              className="bg-nortech-purple hover:bg-nortech-purple/90"
            >
              Finish
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeaturesForm;
