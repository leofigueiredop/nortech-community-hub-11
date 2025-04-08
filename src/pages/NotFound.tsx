
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-nortech-dark-bg p-4">
      <div className="w-20 h-20 bg-nortech-purple rounded-full flex items-center justify-center mb-6">
        <span className="text-white text-4xl">404</span>
      </div>
      <h1 className="text-3xl font-bold mb-2 dark:text-white">Page not found</h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Sorry, we couldn't find the page you're looking for. The page might have been removed or the URL might be incorrect.
      </p>
      <Button asChild>
        <Link to="/">
          Back to home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
