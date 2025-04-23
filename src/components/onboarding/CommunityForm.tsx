
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';

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
    
    // Salvar dados da comunidade
    localStorage.setItem('communityData', JSON.stringify(formData));
    localStorage.setItem('onboardingStep', '4');
    
    // Mostrar feedback
    toast({
      title: "🎖️ Achievement Unlocked!",
      description: "Community details saved (+15 XP)",
      duration: 3000,
    });
    
    // Navegar para próxima etapa
    navigate('/onboarding/creator');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-nortech-purple rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-4xl font-bold">N</span>
          </div>
          
          <div className="w-full mb-6">
            <Progress value={66.6} className="h-2 w-full" />
            <p className="text-xs text-center text-muted-foreground mt-1">Step 4 of 6</p>
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
                .nortech.company
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-nortech-purple hover:bg-nortech-purple/90"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommunityForm;
