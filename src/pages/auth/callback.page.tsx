import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CallbackPage: React.FC = () => {
  const { handleAuthCallback } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const response = await handleAuthCallback();
        
        // If user is a creator, redirect to dashboard
        if (response.user.role === 'creator' || response.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          // For regular users, continue with onboarding
          navigate('/auth/profile-setup');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication failed",
          description: error instanceof Error ? error.message : "Could not complete authentication",
          variant: "destructive"
        });
        navigate('/auth/login');
      }
    };

    processCallback();
  }, [handleAuthCallback, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing authentication...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default CallbackPage; 