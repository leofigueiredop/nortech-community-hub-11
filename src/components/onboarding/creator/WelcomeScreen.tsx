
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Building2 } from 'lucide-react';
import CreatorOnboardingLayout from './CreatorOnboardingLayout';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStartSetup = () => {
    navigate('/onboarding/community-type');
  };

  const handleTalkToSales = () => {
    // Here you would integrate with your CRM or open Calendly
    window.open('https://calendly.com/your-sales-team', '_blank');
  };

  return (
    <CreatorOnboardingLayout>
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to your community HQ
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Let's help you launch and grow your own learning & engagement ecosystem
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <Button 
              size="lg"
              className="text-lg px-8 bg-purple-600 hover:bg-purple-700"
              onClick={handleStartSetup}
            >
              Start Setup
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="w-full max-w-md bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm mb-4">
                💼 Already managing a large community or monetizing content?
                <br />
                Talk to our commercial team for custom plans and revenue scaling.
              </p>
              <Button 
                variant="outline"
                size="sm"
                className="bg-white hover:bg-white/90"
                onClick={handleTalkToSales}
              >
                Talk to Sales
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </CreatorOnboardingLayout>
  );
};

export default WelcomeScreen;
