
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const WhiteLabelAppCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10">
      <CardHeader>
        <CardTitle>Launch your white-label app</CardTitle>
        <CardDescription>
          Get your own mobile app on the App Store & Play Store with your branding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <li>✓ Custom branded mobile apps</li>
          <li>✓ App Store & Play Store presence</li>
          <li>✓ Push notifications</li>
          <li>✓ Native mobile experience</li>
        </ul>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          Book a Demo Call
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhiteLabelAppCard;
