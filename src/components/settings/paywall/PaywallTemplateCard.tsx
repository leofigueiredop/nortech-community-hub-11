
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';

interface PaywallTemplateCardProps {
  title: string;
  description: string;
  preview: React.ReactNode;
  isActive: boolean;
  onSelect: () => void;
  onPreview: (e: React.MouseEvent) => void;
}

const PaywallTemplateCard: React.FC<PaywallTemplateCardProps> = ({
  title,
  description,
  preview,
  isActive,
  onSelect,
  onPreview
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${isActive ? 'ring-2 ring-purple-500' : 'hover:shadow-md'}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          {isActive && (
            <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
              Active
            </div>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-50 dark:bg-slate-800 border rounded-lg p-4 flex items-center justify-center">
          <div className="w-full max-w-xs mx-auto">
            {preview}
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
            e.stopPropagation();
            onPreview(e);
          }}>
            <Eye size={16} className="mr-1" /> Preview
          </Button>
          <Button size="sm" className="flex-1" onClick={(e) => e.stopPropagation()}>
            <Edit size={16} className="mr-1" /> Customize
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaywallTemplateCard;
