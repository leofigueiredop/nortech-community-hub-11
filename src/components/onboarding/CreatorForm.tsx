
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

const formSchema = z.object({
  fullName: z.string().min(2, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

type FormData = z.infer<typeof formSchema>;

const CreatorForm: React.FC = () => {
  const navigate = useNavigate();
  const [showBadge, setShowBadge] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
    
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('onboardingStep', '1');
    
    // Show achievement badge
    setShowBadge(true);
    
    setTimeout(() => {
      // Corrigido: direcionar para a página de tipo de comunidade
      navigate('/onboarding/community-type');
    }, 1500);
    
    // Show achievement toast
    toast({
      title: "🎖️ Achievement Unlocked!",
      description: "First step completed: Account Created (+15 XP)",
      duration: 3000,
    });
  };

  const handleGoogleSignIn = () => {
    // Integrate with Google Auth here
    console.log('Google sign-in clicked');
    
    // Store onboarding step
    localStorage.setItem('onboardingStep', '1');
    
    // Show achievement badge
    setShowBadge(true);
    
    setTimeout(() => {
      // Corrigido: direcionar para a página de tipo de comunidade
      navigate('/onboarding/community-type');
    }, 1500);
    
    // Show achievement toast
    toast({
      title: "🎖️ Achievement Unlocked!",
      description: "First step completed: Account Created (+15 XP)",
      duration: 3000,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto relative">
      {showBadge && (
        <div className="absolute -top-5 -right-5 bg-nortech-purple text-white p-2 rounded-full animate-bounce shadow-lg">
          <Sparkles className="h-6 w-6" />
        </div>
      )}
      
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-nortech-purple rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-4xl font-bold">N</span>
          </div>
          
          <div className="w-full mb-6">
            <Progress value={16.6} className="h-2 w-full" />
            <p className="text-xs text-center text-muted-foreground mt-1">Step 1 of 6</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Crie sua conta Nortech</h2>
        <p className="text-center text-muted-foreground mb-8">
          Comece a construir sua comunidade em minutos
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field}
                        placeholder="Seu nome completo" 
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
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field}
                        type="email"
                        placeholder="seu@email.com" 
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field}
                        type="password"
                        placeholder="Mínimo 8 caracteres" 
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
              className="w-full bg-nortech-purple hover:bg-nortech-purple/90 mt-2"
            >
              Criar conta <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continuar com Google
        </Button>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          Já tem uma conta? <a href="#" className="text-nortech-purple hover:underline">Entre aqui</a>
        </p>
      </CardContent>
    </Card>
  );
};

export default CreatorForm;
