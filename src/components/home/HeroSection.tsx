
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const HeroSection = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Please enter a valid email",
        description: "We need your email to get you started",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Thanks for signing up!",
      description: "We'll be in touch shortly with your account details.",
    });
    
    setEmail('');
  };
  
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">The complete community platform</h1>
          <p className="text-xl md:text-2xl text-indigo-200 mb-10 max-w-3xl mx-auto">
            Build a home for your community, events, and courses — all under your own brand.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-10">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button type="submit" className="h-12 px-6 bg-white text-indigo-900 hover:bg-white/90 font-medium">
              Get Started
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              asChild
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 font-medium"
            >
              <Link to="/dashboard">
                View Demo
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 font-medium"
            >
              <Link to="/settings/plans">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Gradient curve decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-64 z-0 overflow-hidden">
        <svg viewBox="0 0 1200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full">
          <path d="M0,300 C300,100 900,100 1200,300" stroke="url(#gradient)" strokeWidth="3" fill="none" />
          <circle cx="300" cy="100" r="8" fill="#6366F1" />
          <circle cx="600" cy="100" r="8" fill="#8B5CF6" />
          <circle cx="900" cy="100" r="8" fill="#EC4899" />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="75%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
