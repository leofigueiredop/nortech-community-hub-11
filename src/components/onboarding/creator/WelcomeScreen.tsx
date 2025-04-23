
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import CreatorOnboardingLayout from './CreatorOnboardingLayout';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStartSetup = () => {
    navigate('/onboarding/creator');
  };

  return (
    <CreatorOnboardingLayout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-0 shadow-xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-block mb-4 bg-white dark:bg-gray-800 p-4 rounded-full shadow-md">
                <svg
                  className="w-12 h-12 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Welcome to your community HQ
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                Let's help you launch and grow your own learning & engagement ecosystem
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Button 
                size="lg"
                onClick={handleStartSetup}
                className="text-lg px-12 py-6 bg-purple-600 hover:bg-purple-700 transform transition-all duration-200 hover:scale-105"
              >
                Start Setup
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </CreatorOnboardingLayout>
  );
};

export default WelcomeScreen;
