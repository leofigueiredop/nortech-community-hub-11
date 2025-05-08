import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to Nortech Community Hub
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Connect, learn, and grow with your community.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/auth/login">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 