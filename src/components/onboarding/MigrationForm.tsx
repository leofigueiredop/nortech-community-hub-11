
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { migrationFormSchema, MigrationFormData } from './migration/types';
import MigrationTypeSelector from './migration/MigrationTypeSelector';
import PlatformSelector from './migration/PlatformSelector';
import FileUploader from './migration/FileUploader';

const MigrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  
  const form = useForm<MigrationFormData>({
    resolver: zodResolver(migrationFormSchema),
    defaultValues: {
      migrationType: 'new',
      platform: '',
    },
  });
  
  const migrationType = form.watch('migrationType');
  
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
  
  const onSubmit = (data: MigrationFormData) => {
    console.log('Migration data:', data);
    localStorage.setItem('migrationData', JSON.stringify(data));
    localStorage.setItem('onboardingStep', '2');
    setShowBadge(true);
    
    toast({
      title: "🎖️ Achievement Unlocked!",
      description: "Migration preference set (+15 XP) - 33% completed!",
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/onboarding/community-type');
    }, 1500);
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
            <MigrationTypeSelector 
              form={form} 
              onTypeChange={(value) => setShowUpload(value === 'existing')} 
            />
            
            {migrationType === 'existing' && (
              <>
                <PlatformSelector form={form} />
                <FileUploader form={form} onFileChange={handleFileChange} />
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
