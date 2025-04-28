
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ContentForm from '../form/ContentForm';

const ContentTab: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log('Content submitted:', data);
    // In a real application, this would submit the data to an API
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Content</CardTitle>
        <CardDescription>
          Fill out the form below to create and publish new content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContentForm onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
};

export default ContentTab;
