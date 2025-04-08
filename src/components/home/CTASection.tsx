
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-nortech-purple text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to build your community?
        </h2>
        <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
          Start your 14-day free trial today. No credit card required.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-nortech-purple hover:bg-white/90 text-lg px-8 font-medium">
            <Link to="/onboarding/community">
              Get Started Free
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 font-medium">
            <Link to="/dashboard">
              View Demo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
