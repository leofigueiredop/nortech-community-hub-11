
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Settings</CardTitle>
        <CardDescription>
          Manage settings for your content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Settings content here.</p>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
