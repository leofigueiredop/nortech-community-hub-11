
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import SpaceTypesGrid from '@/components/create-space/SpaceTypesGrid';
import SpaceDetailsForm from '@/components/create-space/SpaceDetailsForm';
import TemplatesSection from '@/components/create-space/TemplatesSection';
import { spaceTypes, templateOptions } from '@/components/create-space/data/spaceTypesData';

const CreateSpace: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [detailsStep, setDetailsStep] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const { toast } = useToast();

  const handleCreateSpace = () => {
    if (!spaceName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a name for your space.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Space created",
      description: `Your ${selectedType} space "${spaceName}" has been created successfully.`,
    });

    setSelectedType(null);
    setDetailsStep(false);
    setSpaceName('');
    setSpaceDescription('');
  };

  if (detailsStep && selectedType) {
    const spaceType = spaceTypes.find(s => s.type === selectedType);
    
    return (
      <MainLayout>
        <SpaceDetailsForm
          spaceType={spaceType || null}
          spaceName={spaceName}
          spaceDescription={spaceDescription}
          onSpaceNameChange={setSpaceName}
          onSpaceDescriptionChange={setSpaceDescription}
          onGoBack={() => setDetailsStep(false)}
          onCreateSpace={handleCreateSpace}
        />
      </MainLayout>
    );
  }

  // Add ids to template options
  const templatesWithIds = templateOptions.map((template, index) => ({
    ...template,
    id: `template-${index}`
  }));

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create a Space</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Spaces help you organize content and engage with your community in different ways.
        </p>
      </div>
      
      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="ai">AI-Powered</TabsTrigger>
        </TabsList>
        
        <SpaceTypesGrid 
          currentTab={currentTab}
          spaceTypes={spaceTypes}
          onSelectType={(type) => {
            setSelectedType(type);
            setDetailsStep(true);
          }}
        />
      </Tabs>
      
      <TemplatesSection templateOptions={templatesWithIds} />
    </MainLayout>
  );
};

export default CreateSpace;
