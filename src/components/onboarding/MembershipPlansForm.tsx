
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Plus, DollarSign, Minus, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  createPlans: z.boolean().default(true),
  plans: z.array(
    z.object({
      name: z.string().min(1, "Plan name is required"),
      price: z.number().min(0, "Price must be 0 or greater"),
      description: z.string().optional(),
      benefits: z.array(z.string()).optional(),
    })
  ).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PlanFormValues {
  name: string;
  price: number;
  description: string;
  benefits: string[];
}

const MembershipPlansForm: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanFormValues[]>([
    {
      name: "Free",
      price: 0,
      description: "Basic access to the community",
      benefits: ["Access to free content", "Join discussions", "Attend public events"]
    }
  ]);
  const [showBadge, setShowBadge] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createPlans: true,
      plans: plans,
    },
  });
  
  const createPlans = form.watch('createPlans');
  
  const addPlan = () => {
    setPlans([
      ...plans,
      {
        name: "",
        price: 0,
        description: "",
        benefits: [""]
      }
    ]);
  };
  
  const removePlan = (index: number) => {
    if (plans.length > 1) {
      setPlans(plans.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one plan for your community",
        duration: 3000,
      });
    }
  };
  
  const updatePlan = (index: number, field: keyof PlanFormValues, value: any) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = {
      ...updatedPlans[index],
      [field]: value
    };
    setPlans(updatedPlans);
  };
  
  const addBenefit = (planIndex: number) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].benefits.push("");
    setPlans(updatedPlans);
  };
  
  const removeBenefit = (planIndex: number, benefitIndex: number) => {
    if (plans[planIndex].benefits.length > 1) {
      const updatedPlans = [...plans];
      updatedPlans[planIndex].benefits = updatedPlans[planIndex].benefits.filter((_, i) => i !== benefitIndex);
      setPlans(updatedPlans);
    }
  };
  
  const updateBenefit = (planIndex: number, benefitIndex: number, value: string) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].benefits[benefitIndex] = value;
    setPlans(updatedPlans);
  };
  
  const onSubmit = (data: FormData) => {
    data.plans = plans;
    console.log('Membership plans data:', data);
    
    // Store plans data
    localStorage.setItem('membershipPlans', JSON.stringify({
      createPlans: data.createPlans,
      plans: data.createPlans ? plans : []
    }));
    localStorage.setItem('onboardingStep', '6');
    
    // Show achievement badge
    setShowBadge(true);
    
    // Show achievement toast
    toast({
      title: "🎖️ Achievement Unlocked!",
      description: "Membership plans created (+20 XP) - Almost there!",
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
      description: "You can set up membership plans later from the dashboard.",
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
            <Progress value={90} className="h-2 w-full" />
            <p className="text-xs text-center text-muted-foreground mt-1">Step 6 of 6</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Set Up Membership Plans</h2>
        <p className="text-center text-muted-foreground mb-8">
          Create different access levels for your community members
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="createPlans"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Create membership plans now?</FormLabel>
                    <FormDescription>
                      You can setup different tiers of access for your community members
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {createPlans && (
              <div className="space-y-8">
                {plans.map((plan, planIndex) => (
                  <div key={planIndex} className="border rounded-lg p-6 relative">
                    {plans.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlan(planIndex)}
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`plan-name-${planIndex}`}>Plan Name</Label>
                        <Input
                          id={`plan-name-${planIndex}`}
                          value={plan.name}
                          onChange={(e) => updatePlan(planIndex, 'name', e.target.value)}
                          placeholder="e.g., Basic, Pro, Premium"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`plan-price-${planIndex}`}>Price (USD)</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`plan-price-${planIndex}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={plan.price}
                            onChange={(e) => updatePlan(planIndex, 'price', parseFloat(e.target.value) || 0)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Label htmlFor={`plan-description-${planIndex}`}>Description</Label>
                      <Textarea
                        id={`plan-description-${planIndex}`}
                        value={plan.description}
                        onChange={(e) => updatePlan(planIndex, 'description', e.target.value)}
                        placeholder="Describe what members get with this plan"
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Benefits</Label>
                      <div className="space-y-2 mt-1">
                        {plan.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex gap-2">
                            <Input
                              value={benefit}
                              onChange={(e) => updateBenefit(planIndex, benefitIndex, e.target.value)}
                              placeholder="e.g., Access to exclusive content"
                            />
                            {plan.benefits.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeBenefit(planIndex, benefitIndex)}
                                className="h-10 w-10 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addBenefit(planIndex)}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Benefit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPlan}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Plan
                </Button>
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
      </CardContent>
    </Card>
  );
};

export default MembershipPlansForm;
