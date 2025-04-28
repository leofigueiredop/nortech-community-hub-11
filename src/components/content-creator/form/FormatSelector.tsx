
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ContentFormat } from '@/types/library';
import { FileText, Video, Headphones, FileCode, Link, Layers } from 'lucide-react';

interface FormatSelectorProps {
  value: ContentFormat;
  onChange: (value: ContentFormat) => void;
}

interface FormatOption {
  value: ContentFormat;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ value, onChange }) => {
  const formatOptions: FormatOption[] = [
    {
      value: 'video',
      label: 'Video',
      icon: <Video className="h-5 w-5" />,
      description: 'Upload or link to a video'
    },
    {
      value: 'audio',
      label: 'Audio',
      icon: <Headphones className="h-5 w-5" />,
      description: 'Upload or link to audio content'
    },
    {
      value: 'pdf',
      label: 'PDF',
      icon: <FileText className="h-5 w-5" />,
      description: 'Upload a PDF document'
    },
    {
      value: 'document',
      label: 'Document',
      icon: <FileCode className="h-5 w-5" />,
      description: 'Create a formatted document'
    },
    {
      value: 'text',
      label: 'Text',
      icon: <FileText className="h-5 w-5" />,
      description: 'Simple text content'
    },
    {
      value: 'link',
      label: 'Link',
      icon: <Link className="h-5 w-5" />,
      description: 'Link to external content'
    },
    {
      value: 'course',
      label: 'Course',
      icon: <Layers className="h-5 w-5" />,
      description: 'Multi-module course'
    }
  ];

  return (
    <div className="space-y-3">
      <Label>Content Format</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as ContentFormat)}
        className="grid grid-cols-2 md:grid-cols-4 gap-2"
      >
        {formatOptions.map((option) => (
          <div key={option.value} className={`
            flex flex-col items-center border rounded-md p-3 cursor-pointer transition-all
            ${value === option.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}
          `}>
            <RadioGroupItem 
              value={option.value} 
              id={`format-${option.value}`}
              className="sr-only"
            />
            <Label 
              htmlFor={`format-${option.value}`} 
              className="cursor-pointer flex flex-col items-center gap-1 w-full"
            >
              <div className={`p-2 rounded-full ${value === option.value ? 'text-primary' : 'text-muted-foreground'}`}>
                {option.icon}
              </div>
              <span className="font-medium">{option.label}</span>
              <p className="text-xs text-muted-foreground text-center">
                {option.description}
              </p>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FormatSelector;
