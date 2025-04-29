import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { emailConfirmation } = useAuth();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      toast.error('Invalid confirmation link');
      navigate('/login');
      return;
    }

    async function verifyEmail() {
      try {
        const { error } = await emailConfirmation.verifyToken(token);
        
        if (error) {
          throw error;
        }

        toast.success('Email confirmed successfully!');
        navigate('/login');
      } catch (error: any) {
        toast.error(error.message || 'Failed to verify email');
        navigate('/login');
      } finally {
        setVerifying(false);
      }
    }

    verifyEmail();
  }, [searchParams, navigate, emailConfirmation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {verifying ? 'Verifying your email...' : 'Verification complete'}
          </p>
        </div>
      </div>
    </div>
  );
} 