
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Analytics</CardTitle>
        <CardDescription>
          View analytics for your content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Analytics content here.</p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
