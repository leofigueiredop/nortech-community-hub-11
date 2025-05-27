import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  fullName: z.string().min(2, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

type FormData = z.infer<typeof formSchema>;

const CreatorForm: React.FC = () => {
  const navigate = useNavigate();
  const [showBadge, setShowBadge] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, setCurrentOnboardingStep } = useAuth();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Register the user using our auth context
      await register(data.email, data.password, data.fullName);
      
      // Show achievement badge
      setShowBadge(true);
      
      toast({
        title: "🎖️ Achievement Unlocked!",
        description: "First step completed: Creator Account Created",
        duration: 3000,
      });
      
      // Update onboarding step
      setCurrentOnboardingStep(2);
      
      // Navigate to community creation
      setTimeout(() => {
        navigate('/onboarding/community');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create your account",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    
    try {
      // This will be implemented with Supabase OAuth later
      toast({
        title: "Google Sign-in",
        description: "Google authentication is not fully implemented yet with Supabase",
        duration: 3000,
      });
      
      // Placeholder for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show achievement badge
      setShowBadge(true);
      
      // Update onboarding step
      setCurrentOnboardingStep(2);
      
      setTimeout(() => {
        navigate('/onboarding/community');
      }, 1500);
      
      toast({
        title: "🎖️ Achievement Unlocked!",
        description: "First step completed: Creator Account Created",
        duration: 3000,
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Sign-in failed",
        description: "There was an error signing in with Google",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-lg animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Your Creator Account
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Start building your community today
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field}
                        placeholder="Your full name" 
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field}
                        type="email"
                        placeholder="your@email.com" 
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field}
                        type="password"
                        placeholder="Create a secure password" 
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Or continue with
          </p>
          <div className="mt-3">
            <Button 
              variant="outline" 
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
              Sign up with Google
            </Button>
          </div>
        </div>

        {showBadge && (
          <div className="absolute top-4 right-4 animate-bounce">
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatorForm;
