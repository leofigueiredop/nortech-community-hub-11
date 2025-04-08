
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-2xl font-bold">
              Nortech
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/features" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium">
                Features
              </Link>
              <Link to="/settings/plans" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium">
                Pricing
              </Link>
              <Link to="/resources" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium">
                Resources
              </Link>
              <Link to="/about" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium">
                About
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-white/80 hover:text-white text-sm font-medium">
              Log in
            </Link>
            <Button asChild className="bg-white text-indigo-900 hover:bg-white/90 font-medium">
              <Link to="/onboarding/community">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
