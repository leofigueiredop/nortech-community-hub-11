import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await handleAuthCallback();
        if (response.user) {
          toast.success('Email verified successfully!');
          navigate('/auth/profile-setup');
        } else {
          throw new Error('Failed to verify email');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        toast.error('Failed to verify email. Please try again.');
        navigate('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [handleAuthCallback, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return null;
} 