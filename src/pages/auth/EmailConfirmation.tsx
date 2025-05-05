import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setError('No confirmation token found in URL');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await handleAuthCallback();
        
        if (!response.user) {
          throw new Error('Failed to verify email');
        }
        
        setStatus('success');
        toast({
          title: "Email verified successfully",
          description: "You will be redirected to complete your profile setup.",
        });
        // Redirect to profile setup after 3 seconds on success
        setTimeout(() => navigate('/auth/profile-setup'), 3000);
      } catch (err) {
        setStatus('error');
        const errorMessage = err instanceof Error ? err.message : 'Failed to verify email';
        setError(errorMessage);
        toast({
          title: "Verification failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };

    verifyEmail();
  }, [searchParams, handleAuthCallback, navigate]);

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Verifying your email...</span>
            </div>
          )}
          
          {status === 'success' && (
            <Alert className="bg-green-50">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your email has been verified. You will be redirected to complete your profile setup.
              </AlertDescription>
            </Alert>
          )}
          
          {status === 'error' && (
            <Alert variant="destructive">
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 