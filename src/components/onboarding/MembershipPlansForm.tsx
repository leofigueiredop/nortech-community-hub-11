import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Sparkles, Plus, DollarSign, CheckCircle2, X, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  planType: z.enum(['free', 'paid']),
  planName: z.string().min(2, 'Plan name is required').optional(),
  planPrice: z.number().min(0, 'Price must be at least 0').optional(),
  planDescription: z.string().optional(),
  features: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PlanFeature {
  id: string;
  name: string;
}

const MembershipPlansForm: React.FC = () => {
  const navigate = useNavigate();
  const [showBadge, setShowBadge] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [planFeatures, setPlanFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planType: 'free',
      features: [],
    },
  });
  
  const handlePlanTypeChange = (value: 'free' | 'paid') => {
    setIsPaid(value === 'paid');
  };
  
  const handleAddFeature = () => {
    if (newFeature.trim() !== '' && !planFeatures.includes(newFeature.trim())) {
      setPlanFeatures([...planFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };
  
  const handleRemoveFeature = (featureToRemove: string) => {
    setPlanFeatures(planFeatures.filter((feature) => feature !== featureToRemove));
  };
  
  const onSubmit = (data: FormData) => {
    form.setValue('features', planFeatures);
    data.features = planFeatures;
    
    console.log('Membership plans data:', data);
    
    localStorage.setItem('membershipPlansData', JSON.stringify(data));
    localStorage.setItem('onboardingStep', '6');
    
    setShowBadge(true);
    
    toast({
      title: "🎖️ Achievement Unlocked!",
      description: "Membership plans configured (+15 XP) - 100% completed!",
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/onboarding/final-step');
    }, 1500);
  };
  
  const handleSkip = () => {
    localStorage.setItem('onboardingStep', '6');
    
    toast({
      title: "Step skipped",
      description: "You can configure membership plans later from the dashboard.",
      duration: 3000,
    });
    
    navigate('/onboarding/final-step');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto relative">
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
            <Progress value={100} className="h-2 w-full" />
            <p className="text-xs text-center text-muted-foreground mt-1">Step 6 of 6</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Configure Membership Plans</h2>
        <p className="text-center text-muted-foreground mb-8">
          Offer premium content and features with paid membership plans
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="planType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Plan Type</FormLabel>
                  <FormControl>
                    <Tabs defaultValue={field.value} className="w-full">
                      <TabsList>
                        <TabsTrigger 
                          value="free"
                          onClick={() => {
                            field.onChange('free');
                            handlePlanTypeChange('free');
                          }}
                        >
                          Free
                        </TabsTrigger>
                        <TabsTrigger 
                          value="paid"
                          onClick={() => {
                            field.onChange('paid');
                            handlePlanTypeChange('paid');
                          }}
                        >
                          Paid
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isPaid && (
              <>
                <Separator className="my-4" />
                
                <FormField
                  control={form.control}
                  name="planName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Premium Membership" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Give your plan a clear and concise name.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="planPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="number"
                            placeholder="9.99" 
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Set the monthly price for your premium plan.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="planDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Description</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Access to exclusive content and community features" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the benefits of your premium plan.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="feature">Plan Features</Label>
                  <div className="flex gap-2">
                    <Input
                      id="feature"
                      type="text"
                      placeholder="Enter plan feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddFeature}
                      className="bg-nortech-purple hover:bg-nortech-purple/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {planFeatures.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium">Features included</Label>
                      <span className="text-xs text-muted-foreground">{planFeatures.length} feature(s)</span>
                    </div>
                    <div className="space-y-2">
                      {planFeatures.map((feature) => (
                        <div key={feature} className="flex justify-between items-center bg-white p-2 rounded border">
                          <span className="text-sm">{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFeature(feature)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
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
        
        <Separator className="my-8" />
        
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Not ready to set up membership plans yet? No problem! You can always configure them later from your dashboard.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipPlansForm;
