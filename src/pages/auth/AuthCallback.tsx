import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const processAuth = async () => {
      try {
        const { data, error } = await handleAuthCallback();
        if (error) throw error;
        if (!data?.session || !data?.user) throw new Error('No session or user found');
        
        // Auth successful, redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error processing auth callback:', error);
        // Auth failed, redirect to login
        navigate('/login');
      }
    };

    processAuth();
  }, [navigate, handleAuthCallback]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" />
      <p className="mt-4 text-lg text-gray-600">Processando autenticação...</p>
    </div>
  );
} 