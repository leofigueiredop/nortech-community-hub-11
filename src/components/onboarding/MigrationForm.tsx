
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  migrationType: z.enum(['new', 'existing']),
  platform: z.string().optional(),
  file: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

const MigrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      migrationType: 'new',
      platform: '',
    },
  });
  
  // Watch the migrationType to conditionally show platform selection
  const migrationType = form.watch('migrationType');
  
  const onSubmit = (data: FormData) => {
    console.log('Migration data:', data);
    
    // Store migration data
    localStorage.setItem('migrationData', JSON.stringify(data));
    localStorage.setItem('onboardingStep', '2');
    
    // Show achievement badge
    setShowBadge(true);
    
    // Show achievement toast
    toast({
      title: "🎖️ Achievement Unlocked!",
      description: "Migration preference set (+15 XP) - 33% completed!",
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/onboarding/community-type');
    }, 1500);
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
            <Progress value={33.3} className="h-2 w-full" />
            <p className="text-xs text-center text-muted-foreground mt-1">Step 2 of 6</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Configuração da Comunidade</h2>
        <p className="text-center text-muted-foreground mb-8">
          Vamos criar a sua comunidade personalizada
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="migrationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Você está começando uma nova comunidade ou migrando uma existente?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowUpload(value === 'existing');
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="new" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          🚀 Estou começando do zero
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="existing" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          🔁 Estou migrando uma comunidade existente
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            {migrationType === 'existing' && (
              <>
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>De qual plataforma você está migrando?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a plataforma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="discord">Discord</SelectItem>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="facebook">Facebook Groups</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                          <SelectItem value="slack">Slack</SelectItem>
                          <SelectItem value="other">Outra plataforma</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Isso nos ajudará a personalizar sua experiência.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="memberList">Upload da lista de membros (opcional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Arraste um arquivo CSV ou clique para selecionar
                    </p>
                    <Input 
                      id="memberList" 
                      type="file" 
                      accept=".csv,.xlsx" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('memberList')?.click()}
                      className="mt-2"
                    >
                      Selecionar arquivo
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: CSV. Tamanho máximo: 5MB.
                  </p>
                </div>
              </>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-nortech-purple hover:bg-nortech-purple/90 mt-4"
            >
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MigrationForm;
