
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Download, Upload } from 'lucide-react';

const MigrationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Data Migration</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Import data from other platforms or export your community data.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={18} />
              Import Data
            </CardTitle>
            <CardDescription>
              Bring your existing community data into Nortech from other platforms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Supported Platforms</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Discord</li>
                <li>Slack</li>
                <li>Facebook Groups</li>
                <li>Circle</li>
                <li>Reddit</li>
              </ul>
            </div>
            <Button>Start Import</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download size={18} />
              Export Data
            </CardTitle>
            <CardDescription>
              Export your community data for backup or migration purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Export Options</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Member profiles and data</li>
                <li>Posts and comments</li>
                <li>Event history</li>
                <li>Content and resources</li>
                <li>Community settings</li>
              </ul>
            </div>
            <Button variant="outline">Export All Data</Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown size={18} />
            Migration History
          </CardTitle>
          <CardDescription>
            View your past data import and export operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p>No migration history available yet.</p>
            <p className="text-sm mt-1">Your past import and export operations will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationSettings;
