
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Interest {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// Sample interests data - this would come from the creator's community settings
const INTERESTS: Interest[] = [
  { 
    id: 'web3', 
    name: 'Web3 / Crypto',
    icon: '🔗',
    description: 'Blockchain, cryptocurrencies, NFTs, and decentralized applications'
  },
  { 
    id: 'personal-dev', 
    name: 'Personal Development',
    icon: '🌱',
    description: 'Growth mindset, productivity, self-improvement, and mindfulness'
  },
  { 
    id: 'finance', 
    name: 'Finance',
    icon: '💰',
    description: 'Investing, saving, financial freedom, and wealth building'
  },
  { 
    id: 'tech-ai', 
    name: 'Tech / AI',
    icon: '🤖',
    description: 'Artificial intelligence, programming, innovation, and digital tools'
  },
  { 
    id: 'career', 
    name: 'Career & Freelance',
    icon: '💼',
    description: 'Job hunting, remote work, freelancing, and professional growth'
  },
  { 
    id: 'creativity', 
    name: 'Creativity & Design',
    icon: '🎨',
    description: 'Artistic expression, design thinking, and creative workflows'
  },
  { 
    id: 'marketing', 
    name: 'Marketing',
    icon: '📣',
    description: 'Digital marketing, branding, audience building, and growth'
  },
  { 
    id: 'wellbeing', 
    name: 'Health & Wellbeing',
    icon: '🧘',
    description: 'Physical fitness, mental health, nutrition, and balance'
  }
];

const Step5Interests: React.FC = () => {
  const { updateProfile, updateOnboardingStep } = useAuth();
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const toggleInterest = (interestId: string) => {
    setSelectedInterests(current => 
      current.includes(interestId)
        ? current.filter(id => id !== interestId)
        : [...current, interestId]
    );
  };

  const handleSubmit = () => {
    // Update profile with selected interests
    updateProfile({ 
      interests: selectedInterests 
    });
    
    // Show toast with selected interests count
    toast({
      title: `${selectedInterests.length} interests selected!`,
      description: "Your content will be personalized based on your preferences",
    });
    
    // Move to next step
    updateOnboardingStep(6);
    navigate('/auth/engagement');
  };

  const handleSkip = () => {
    // Just move to next step without setting interests
    updateOnboardingStep(6);
    navigate('/auth/engagement');
  };

  return (
    <Card className="w-full shadow-lg animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-center mb-2">
          What are you interested in?
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Select topics to personalize your experience
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {INTERESTS.map((interest) => (
            <div
              key={interest.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedInterests.includes(interest.id)
                  ? 'bg-primary/10 border-primary border'
                  : 'border border-border hover:bg-muted/50'
              }`}
              onClick={() => toggleInterest(interest.id)}
            >
              <div className="flex-shrink-0 mr-3 text-2xl" aria-hidden="true">
                {interest.icon}
              </div>
              <div>
                <h3 className="font-medium text-sm">{interest.name}</h3>
                <p className="text-xs text-muted-foreground">{interest.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="sm:flex-1"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
          <Button
            className="sm:flex-1"
            onClick={handleSubmit}
            disabled={selectedInterests.length === 0}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            {selectedInterests.length === 0 
              ? "Select at least one interest to personalize your experience" 
              : `${selectedInterests.length} topic${selectedInterests.length !== 1 ? 's' : ''} selected`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step5Interests;
