
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Upload, Users, Sparkles, Plus, Mail, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const emailSchema = z.string().email("Invalid email format");

const formSchema = z.object({
  emails: z.array(emailSchema).optional(),
  file: z.any().optional(),
  skip: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const InviteMembersForm: React.FC = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: [],
      skip: false,
    },
  });
  
  const handleAddEmail = () => {
    try {
      const validatedEmail = emailSchema.parse(currentEmail);
      if (!emails.includes(validatedEmail)) {
        setEmails([...emails, validatedEmail]);
        setCurrentEmail('');
        setEmailError(null);
      } else {
        setEmailError('Email already added');
      }
    } catch (error) {
      setEmailError('Please enter a valid email address');
    }
  };
  
  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      form.setValue('file', e.target.files[0]);
      toast({
        title: "File uploaded",
        description: "Your member list has been uploaded successfully.",
        duration: 3000,
      });
    }
  };
  
  const onSubmit = (data: FormData) => {
    // Add the emails to the form data
    form.setValue('emails', emails);
    data.emails = emails;
    
    console.log('Invite data:', data);
    
    // Store invite data
    localStorage.setItem('inviteData', JSON.stringify({
      emails: emails,
      hasFile: !!data.file,
    }));
    localStorage.setItem('onboardingStep', '5');
    
    // Show achievement badge
    setShowBadge(true);
    
    // Show achievement toast
    toast({
      title: "🎖️ Achievement Unlocked!",
      description: "Member invites prepared (+15 XP) - 83% completed!",
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/onboarding/membership-plans');
    }, 1500);
  };
  
  const handleSkip = () => {
    localStorage.setItem('onboardingStep', '5');
    
    toast({
      title: "Step skipped",
      description: "You can invite members later from the dashboard.",
      duration: 3000,
    });
    
    navigate('/onboarding/membership-plans');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto relative">
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
            <Progress value={83.3} className="h-2 w-full" />
            <p className="text-xs text-center text-muted-foreground mt-1">Step 5 of 6</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Invite Members to Your Community</h2>
        <p className="text-center text-muted-foreground mb-8">
          Build your audience by inviting members or start with your team
        </p>
        
        <Tabs defaultValue="email" className="mt-8">
          <TabsList className="w-full mb-8">
            <TabsTrigger value="email" className="flex-1">Email Invites</TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">Upload CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Addresses</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddEmail();
                          }
                        }}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleAddEmail}
                      className="bg-nortech-purple hover:bg-nortech-purple/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                </div>
                
                {emails.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium">Emails to invite</Label>
                      <span className="text-xs text-muted-foreground">{emails.length} email(s)</span>
                    </div>
                    <div className="space-y-2">
                      {emails.map((email) => (
                        <div key={email} className="flex justify-between items-center bg-white p-2 rounded border">
                          <span className="text-sm">{email}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEmail(email)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleSkip}
                  >
                    Skip for now
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="bg-nortech-purple hover:bg-nortech-purple/90"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="memberList">Upload member list CSV</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag a CSV file or click to select
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      CSV should contain columns: email, first_name, last_name (optional)
                    </p>
                    <Input 
                      id="memberList" 
                      type="file" 
                      accept=".csv" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('memberList')?.click()}
                      className="mt-2"
                    >
                      Select file
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Format: CSV. Max size: 5MB. Up to 500 members at once.
                  </p>
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleSkip}
                  >
                    Skip for now
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="bg-nortech-purple hover:bg-nortech-purple/90"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-8" />
        
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Not ready to invite members yet? No problem! You can always invite members later from your dashboard.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteMembersForm;
