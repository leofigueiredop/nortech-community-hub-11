
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <Card className="cursor-pointer hover:border-nortech-purple transition-colors" onClick={onClick}>
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <div className="bg-nortech-purple/10 p-2 rounded-lg">
            {icon}
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs line-clamp-2">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
