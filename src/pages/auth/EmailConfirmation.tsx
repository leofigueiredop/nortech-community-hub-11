import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { emailConfirmation } = useAuth();
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
        const { error: verifyError } = await emailConfirmation.verifyToken(token);
        
        if (verifyError) {
          throw verifyError;
        }
        
        setStatus('success');
        // Redirect to profile setup after 3 seconds on success
        setTimeout(() => navigate('/auth/profile-setup'), 3000);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to verify email');
      }
    };

    verifyEmail();
  }, [searchParams, emailConfirmation, navigate]);

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