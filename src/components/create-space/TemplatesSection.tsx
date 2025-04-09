
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import TemplateCard from './TemplateCard';
import { useToast } from '@/hooks/use-toast';

interface TemplateOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TemplatesSectionProps {
  templateOptions: TemplateOption[];
}

const TemplatesSection: React.FC<TemplatesSectionProps> = ({ templateOptions: initialTemplates }) => {
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>(
    // Add IDs if not already present
    initialTemplates.map((template, index) => ({
      ...template,
      id: template.id || `template-${index}`
    }))
  );
  const { toast } = useToast();

  const handleDeleteTemplate = (id: string) => {
    setTemplateOptions(prev => prev.filter(template => template.id !== id));
    toast({
      title: "Template removed",
      description: "The template has been removed from your options.",
    });
  };

  return (
    <div className="mt-12 bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Start with a template</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Get started quickly with pre-configured spaces designed for specific use cases.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {templateOptions.map((template) => (
          <TemplateCard
            key={template.id}
            icon={template.icon}
            title={template.title}
            description={template.description}
            onDelete={() => handleDeleteTemplate(template.id)}
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button className="shrink-0">
          Browse all templates <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TemplatesSection;
