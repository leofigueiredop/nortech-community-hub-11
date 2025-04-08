
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Paragraph, 
  Heading2, 
  Heading3, 
  ListOrdered, 
  List, 
  Quote, 
  Minus, 
  Code, 
  Smile, 
  AtSign, 
  Link2,
  Sparkles
} from 'lucide-react';

interface TextEditorMenuProps {
  onSelect: (format: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const TextEditorMenu: React.FC<TextEditorMenuProps> = ({ onSelect, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatOptions = [
    { 
      title: 'BASIC',
      items: [
        { icon: Sparkles, label: 'Co-pilot', format: 'co-pilot' },
        { icon: Paragraph, label: 'Paragraph', format: 'paragraph' },
        { icon: Heading2, label: 'Heading 2', format: 'h2' },
        { icon: Heading3, label: 'Heading 3', format: 'h3' },
        { icon: ListOrdered, label: 'Numbered list', format: 'numbered-list' },
        { icon: List, label: 'Bulleted list', format: 'bulleted-list' },
        { icon: Quote, label: 'Blockquote', format: 'blockquote' },
        { icon: Minus, label: 'Divider', format: 'divider' },
        { icon: Code, label: 'Code', format: 'code' },
        { icon: Smile, label: 'Emoji', format: 'emoji' },
        { icon: AtSign, label: 'Mention', format: 'mention' },
        { icon: Link2, label: 'Button', format: 'button' },
      ]
    }
  ];

  const handleSelect = (format: string) => {
    onSelect(format);
    onClose();
  };

  return (
    <div className="absolute left-0 bottom-12 w-[250px] z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg overflow-hidden max-h-[400px] overflow-y-auto">
      {formatOptions.map((section) => (
        <div key={section.title} className="p-0">
          <div className="bg-gray-800 px-4 py-2 text-gray-400 text-xs font-semibold">
            {section.title}
          </div>
          <div className="p-1">
            {section.items.map((item) => (
              <Button
                key={item.format}
                variant="ghost"
                className="flex items-center justify-start w-full text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 h-auto"
                onClick={() => handleSelect(item.format)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TextEditorMenu;
