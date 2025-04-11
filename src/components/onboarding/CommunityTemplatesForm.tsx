
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layout, LayoutTemplate, FileText, Users, BookOpen, Calendar, Brain, Puzzle, Briefcase, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormLabel } from '@/components/ui/form';

interface Template {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  type: 'education' | 'mastermind' | 'product' | 'internal' | 'other' | 'blank';
}

const CommunityTemplatesForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [communityType, setCommunityType] = useState<string>('education');

  useEffect(() => {
    // Get previously selected community type from localStorage
    const storedType = localStorage.getItem('communityType');
    if (storedType) {
      setCommunityType(storedType);
    }
  }, []);

  const templates: Template[] = [
    {
      id: 'education-academy',
      title: 'Learning Academy',
      description: 'Complete platform for courses, lessons, and student engagement',
      image: '/placeholder.svg',
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      type: 'education'
    },
    {
      id: 'education-community',
      title: 'Education Community',
      description: 'Discussion-focused community for teachers and students',
      image: '/placeholder.svg',
      icon: <Users className="h-6 w-6 text-blue-500" />,
      type: 'education'
    },
    {
      id: 'mastermind-group',
      title: 'Mastermind Group',
      description: 'For peer networking, goal setting, and accountability',
      image: '/placeholder.svg',
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      type: 'mastermind'
    },
    {
      id: 'mastermind-coaching',
      title: 'Coaching Program',
      description: 'For coaches offering 1:1 and group sessions',
      image: '/placeholder.svg',
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      type: 'mastermind'
    },
    {
      id: 'product-community',
      title: 'Product Community',
      description: 'User support, feedback, and feature announcements',
      image: '/placeholder.svg',
      icon: <Puzzle className="h-6 w-6 text-green-500" />,
      type: 'product'
    },
    {
      id: 'internal-team',
      title: 'Internal Workspace',
      description: 'Collaboration space for company teams',
      image: '/placeholder.svg',
      icon: <Briefcase className="h-6 w-6 text-amber-500" />,
      type: 'internal'
    },
    {
      id: 'other-custom',
      title: 'Custom Community',
      description: 'Tailored to your specific needs and goals',
      image: '/placeholder.svg',
      icon: <Target className="h-6 w-6 text-red-500" />,
      type: 'other'
    },
    {
      id: 'blank',
      title: 'Blank Community',
      description: 'Start from scratch and build your own',
      image: '/placeholder.svg',
      icon: <Layout className="h-6 w-6 text-gray-500" />,
      type: 'blank'
    }
  ];

  // Filter templates based on community type
  const recommendedTemplates = templates.filter(template => 
    template.type === communityType || template.type === 'blank'
  );
  
  // Include all templates for browsing
  const allTemplates = templates;

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      // Store selected template
      localStorage.setItem('selectedTemplate', selectedTemplate);
      // Navigate to next step
      navigate('/onboarding/community');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-nortech-purple rounded-lg flex items-center justify-center">
            <span className="text-white text-4xl font-bold">N</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Choose a community template</h2>
        <p className="text-center text-muted-foreground mb-8">
          Get started faster with a pre-configured template (you can customize everything later)
        </p>
        
        <Tabs defaultValue="recommended" className="w-full">
          <TabsList className="mb-6 mx-auto">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="all">Browse All</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {recommendedTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-nortech-purple ${
                    selectedTemplate === template.id ? 'border-2 border-nortech-purple ring-2 ring-nortech-purple/20' : ''
                  }`}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-slate-100 p-2 rounded-md">
                      {template.icon}
                    </div>
                    <h3 className="font-medium">{template.title}</h3>
                  </div>
                  
                  <div className="aspect-video bg-slate-100 rounded-md mb-3 overflow-hidden">
                    <img 
                      src={template.image} 
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {allTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-nortech-purple ${
                    selectedTemplate === template.id ? 'border-2 border-nortech-purple ring-2 ring-nortech-purple/20' : ''
                  }`}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-slate-100 p-2 rounded-md">
                      {template.icon}
                    </div>
                    <h3 className="font-medium">{template.title}</h3>
                  </div>
                  
                  <div className="aspect-video bg-slate-100 rounded-md mb-3 overflow-hidden">
                    <img 
                      src={template.image} 
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center">
          <Button 
            type="button" 
            className="w-full md:w-auto bg-nortech-purple hover:bg-nortech-purple/90"
            onClick={handleContinue}
            disabled={!selectedTemplate}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't worry, you can customize everything after setup
        </p>
      </CardContent>
    </Card>
  );
};

export default CommunityTemplatesForm;
