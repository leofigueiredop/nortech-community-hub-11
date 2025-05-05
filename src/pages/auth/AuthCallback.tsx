import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const response = await handleAuthCallback();
        if (response.user) {
          navigate('/dashboard');
        } else {
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth/login');
      }
    };

    handleCallback();
  }, [handleAuthCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
} 