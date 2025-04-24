
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Download, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data for campaigns analytics
const analyticsData = [
  {
    id: '1',
    name: 'Monthly Newsletter - June',
    type: 'manual',
    sent: 1240,
    openRate: 68,
    clickRate: 24,
    unsubscribes: 3,
    bounceRate: 2
  },
  {
    id: '2',
    name: 'Weekly Community Update',
    type: 'automation',
    sent: 980,
    openRate: 72,
    clickRate: 18,
    unsubscribes: 1,
    bounceRate: 1.5
  },
  {
    id: '3',
    name: 'New Feature Announcement',
    type: 'manual',
    sent: 1500,
    openRate: 82,
    clickRate: 45,
    unsubscribes: 2,
    bounceRate: 0.8
  },
  {
    id: '4',
    name: 'Re-engagement Campaign',
    type: 'automation',
    sent: 450,
    openRate: 38,
    clickRate: 12,
    unsubscribes: 8,
    bounceRate: 3.2
  },
  {
    id: '5',
    name: 'Product Launch',
    type: 'manual',
    sent: 2100,
    openRate: 76,
    clickRate: 52,
    unsubscribes: 4,
    bounceRate: 1.2
  }
];

const MarketingAnalytics: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium">Email Marketing Analytics</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Track and analyze your email campaign performance
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            placeholder="Search campaigns..."
            className="w-full"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        <div className="flex flex-row gap-3">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Campaign Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="manual">Manual Campaign</SelectItem>
              <SelectItem value="automation">Automation</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Unsubscribes</TableHead>
                <TableHead>Bounce Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        campaign.type === 'manual' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400' 
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400'
                      }
                    >
                      {campaign.type === 'manual' ? 'Manual' : 'Automation'}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.sent.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={cn(
                      campaign.openRate > 70 ? 'text-green-600 dark:text-green-400' : 
                      campaign.openRate > 50 ? 'text-blue-600 dark:text-blue-400' : 
                      'text-amber-600 dark:text-amber-400'
                    )}>
                      {campaign.openRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      campaign.clickRate > 40 ? 'text-green-600 dark:text-green-400' : 
                      campaign.clickRate > 20 ? 'text-blue-600 dark:text-blue-400' : 
                      'text-amber-600 dark:text-amber-400'
                    )}>
                      {campaign.clickRate}%
                    </span>
                  </TableCell>
                  <TableCell>{campaign.unsubscribes}</TableCell>
                  <TableCell>
                    <span className={cn(
                      campaign.bounceRate < 1 ? 'text-green-600 dark:text-green-400' : 
                      campaign.bounceRate < 2 ? 'text-blue-600 dark:text-blue-400' : 
                      'text-red-600 dark:text-red-400'
                    )}>
                      {campaign.bounceRate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingAnalytics;
