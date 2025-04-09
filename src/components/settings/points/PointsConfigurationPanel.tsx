
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PointsActionsConfig from './PointsActionsConfig';
import PointsCapsConfig from './PointsCapsConfig';
import PointsUserManagement from './PointsUserManagement';
import PointsActivityLog from './PointsActivityLog';
import RewardsManagement from './RewardsManagement';
import PointsTemplates from './PointsTemplates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PointsConfigurationPanel: React.FC = () => {
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
          <PointsTemplates />
        </CardContent>
      </Card>

      <Tabs defaultValue="actions" className="w-full">
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
