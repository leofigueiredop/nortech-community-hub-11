
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  useEffect(() => {
    document.title = "Nortech Communities - All-in-one Community Platform";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl w-full text-center">
        <div className="w-24 h-24 bg-nortech-purple rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl font-bold">N</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-nortech-dark-blue">
          Build Your Digital Community
        </h1>
        
        <p className="text-xl text-nortech-text-muted mb-8 max-w-2xl mx-auto">
          Nortech Communities is a white-label platform for creators, educators, and businesses 
          who want to build engaging digital communities.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            asChild
            className="text-white bg-nortech-purple hover:bg-nortech-purple/90 py-6 px-8 rounded-lg text-lg"
          >
            <Link to="/onboarding/community">
              Get Started
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            className="py-6 px-8 rounded-lg text-lg"
          >
            <Link to="/dashboard">
              View Demo
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-nortech-light-purple rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nortech-purple">
                <path d="M17 6.1H3M21 12.1H3M15.1 18H3"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Social Feed</h3>
            <p className="text-nortech-text-muted">
              Create engaging posts, comments, and likes with a Facebook-style social wall.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-nortech-light-purple rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nortech-purple">
                <path d="M7 10v12"/>
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Gamification</h3>
            <p className="text-nortech-text-muted">
              Reward members with points, badges, and achievements to drive engagement.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-nortech-light-purple rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nortech-purple">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">White Label</h3>
            <p className="text-nortech-text-muted">
              Fully customize colors, logos, and domain to match your brand identity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
