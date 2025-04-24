
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PointsActionsConfig from './PointsActionsConfig';
import PointsCapsConfig from './PointsCapsConfig';
import PointsUserManagement from './PointsUserManagement';
import PointsActivityLog from './PointsActivityLog';
import RewardsManagement from './RewardsManagement';
import PointsTemplates from './PointsTemplates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, LineChart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PointTemplate } from '@/types/points-config';

const PointsConfigurationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('actions');

  const handleTemplateApply = (template: PointTemplate) => {
    console.log('Template applied:', template);
    // Here we would update the state of all related components
    // For now we'll just switch to the actions tab
    setActiveTab('actions');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Points Configuration</h2>
          <p className="text-muted-foreground mt-1">
            Configure how users earn points and redeem rewards in your community
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-help">
                <Info className="h-5 w-5 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent align="end" className="max-w-sm">
              <p>Points are a way to gamify your community and reward active participation.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Quick Setup</CardTitle>
          <CardDescription>
            Get started quickly by choosing a template or configure each setting manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PointsTemplates onApplyTemplate={handleTemplateApply} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Points Analytics</CardTitle>
          <CardDescription>Key metrics about your points system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <LineChart className="h-4 w-4" />
                <span>POINTS DISTRIBUTION</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm whitespace-nowrap">45% Engagement</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm whitespace-nowrap">30% Education</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm whitespace-nowrap">25% Social</span>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">TOTAL POINTS AWARDED</p>
              <p className="text-3xl font-bold">24,580</p>
              <p className="text-sm text-muted-foreground mt-1">+12% from last month</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">REWARDS REDEEMED</p>
              <p className="text-3xl font-bold">37</p>
              <p className="text-sm text-muted-foreground mt-1">8,920 points spent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="actions">Actions & Points</TabsTrigger>
          <TabsTrigger value="caps">Point Caps</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Store</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="logs">Activity Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="actions" className="mt-0">
          <PointsActionsConfig />
        </TabsContent>
        
        <TabsContent value="caps" className="mt-0">
          <PointsCapsConfig />
        </TabsContent>
        
        <TabsContent value="rewards" className="mt-0">
          <RewardsManagement />
        </TabsContent>
        
        <TabsContent value="users" className="mt-0">
          <PointsUserManagement />
        </TabsContent>
        
        <TabsContent value="logs" className="mt-0">
          <PointsActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PointsConfigurationPanel;
