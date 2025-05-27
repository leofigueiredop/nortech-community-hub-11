import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Mail, Shield, Crown, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface InviteData {
  email: string;
  role: string;
  communityId: string;
  communityName?: string;
}

const InviteAccept = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, login, register } = useAuth();
  
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'loading' | 'form' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Parse URL parameters
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const communityId = searchParams.get('communityId') || searchParams.get('community_id');
    
    if (!email || !role || !communityId) {
      setStep('error');
      toast({
        title: 'Invalid Invitation Link',
        description: 'This invitation link appears to be invalid or expired.',
        variant: 'destructive'
      });
      return;
    }

    // Set invite data
    const invite: InviteData = {
      email,
      role,
      communityId,
      communityName: searchParams.get('communityName') || 'Community'
    };
    
    setInviteData(invite);
    setFormData(prev => ({ ...prev, email }));
    
    // Check if user is already logged in
    if (user) {
      if (user.email === email) {
        // User is already logged in with the invited email
        handleAcceptInvite();
      } else {
        // User is logged in with different email
        toast({
          title: 'Different Account',
          description: 'You are logged in with a different email. Please log out and try again.',
          variant: 'destructive'
        });
        setStep('error');
      }
    } else {
      setStep('form');
    }
  }, [searchParams, user]);

  const handleAcceptInvite = async () => {
    if (!inviteData) return;
    
    setIsLoading(true);
    try {
      // Here you would call your API to accept the invitation
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep('success');
      toast({
        title: 'Welcome to the community! 🎉',
        description: `You've successfully joined ${inviteData.communityName}`,
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error accepting invite:', error);
      toast({
        title: 'Failed to Accept Invitation',
        description: 'Please try again or contact support.',
        variant: 'destructive'
      });
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData) return;

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Register new user
      await register(formData.email, formData.password, formData.fullName);
      
      // Accept the invitation
      await handleAcceptInvite();
      
    } catch (error) {
      console.error('Error during signup:', error);
      toast({
        title: 'Registration Failed',
        description: 'Please try again or contact support.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData) return;

    setIsLoading(true);
    try {
      // Login existing user
      await login(formData.email, formData.password);
      
      // Accept the invitation
      await handleAcceptInvite();
      
    } catch (error) {
      console.error('Error during signin:', error);
      toast({
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'moderator':
        return <Shield className="h-5 w-5 text-blue-500" />;
      default:
        return <UserPlus className="h-5 w-5 text-green-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl">Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link appears to be invalid or expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl">Welcome! 🎉</CardTitle>
            <CardDescription>
              You've successfully joined {inviteData?.communityName}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting you to the community dashboard...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle className="text-xl">You're Invited!</CardTitle>
          <CardDescription>
            Join {inviteData?.communityName} as a community member
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Invitation Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Invitation Details</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Community:</span>
                <span className="text-sm font-medium">{inviteData?.communityName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role:</span>
                <Badge className={getRoleBadgeColor(inviteData?.role || '')}>
                  <div className="flex items-center gap-1">
                    {getRoleIcon(inviteData?.role || '')}
                    {inviteData?.role?.charAt(0).toUpperCase() + inviteData?.role?.slice(1)}
                  </div>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm font-medium">{inviteData?.email}</span>
              </div>
            </div>
          </div>

          {/* Toggle between Sign In / Sign Up */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <button
              type="button"
              onClick={() => setIsExistingUser(false)}
              className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                !isExistingUser
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              New Account
            </button>
            <button
              type="button"
              onClick={() => setIsExistingUser(true)}
              className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                isExistingUser
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Existing Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isExistingUser ? handleSignIn : handleSignUp} className="space-y-4">
            {!isExistingUser && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                disabled={true} // Email is pre-filled from invitation
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isExistingUser ? "Enter your password" : "Create a password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>

            {!isExistingUser && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isExistingUser ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  {isExistingUser ? 'Sign In & Join' : 'Create Account & Join'}
                </div>
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            By joining, you agree to the community guidelines and terms of service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteAccept; 