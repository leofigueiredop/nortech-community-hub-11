
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, Layout, Settings } from 'lucide-react';
import ContentTab from './tabs/ContentTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import SettingsTab from './tabs/SettingsTab';

const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="content" className="space-y-4">
      <TabsList>
        <TabsTrigger value="content" className="flex items-center gap-2">
          <Layout size={16} />
          Content
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart2 size={16} />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings size={16} />
          Settings
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="content">
        <ContentTab />
      </TabsContent>
      
      <TabsContent value="analytics">
        <AnalyticsTab />
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
