
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Users, MousePointer, Mail } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface CampaignReportProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for the campaign report
const mockReportData = {
  name: "Monthly Newsletter - June",
  date: "2023-06-15",
  recipients: 1240,
  opens: 843,
  clicks: 298,
  bounces: 25,
  unsubscribes: 3,
  clickedLinks: [
    { url: "https://example.com/blog/article1", clicks: 123 },
    { url: "https://example.com/product/featured", clicks: 89 },
    { url: "https://example.com/events", clicks: 46 }
  ],
  devices: {
    desktop: 62,
    mobile: 32,
    tablet: 6
  },
  opensByTime: [
    { time: '9 AM', opens: 120 },
    { time: '10 AM', opens: 210 },
    { time: '11 AM', opens: 150 },
    { time: '12 PM', opens: 80 },
    { time: '1 PM', opens: 60 },
    { time: '2 PM', opens: 90 },
    { time: '3 PM', opens: 130 }
  ]
};

const CampaignReport: React.FC<CampaignReportProps> = ({ campaignId, isOpen, onClose }) => {
  // In a real app, you would fetch data based on the campaignId
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Campaign Report</span>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <h2 className="text-lg font-semibold">{mockReportData.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Sent on {mockReportData.date}</p>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Mail className="h-8 w-8 text-indigo-500 mb-2" />
                <div className="text-3xl font-bold">{mockReportData.opens}</div>
                <div className="text-sm text-gray-500">Opens</div>
                <div className="text-sm font-medium mt-1 text-indigo-600">{Math.round(mockReportData.opens / mockReportData.recipients * 100)}%</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <MousePointer className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-3xl font-bold">{mockReportData.clicks}</div>
                <div className="text-sm text-gray-500">Clicks</div>
                <div className="text-sm font-medium mt-1 text-green-600">{Math.round(mockReportData.clicks / mockReportData.recipients * 100)}%</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <div className="text-3xl font-bold">{mockReportData.recipients}</div>
                <div className="text-sm text-gray-500">Recipients</div>
                <div className="text-sm font-medium mt-1 text-blue-600">{mockReportData.bounces} bounces</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="engagement" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="links">Clicked Links</TabsTrigger>
          </TabsList>
          
          <TabsContent value="engagement" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Opens Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockReportData.opensByTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="opens" stroke="#8884d8" name="Opens" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Desktop</div>
                    <div className="text-xl font-semibold">{mockReportData.devices.desktop}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Mobile</div>
                    <div className="text-xl font-semibold">{mockReportData.devices.mobile}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Tablet</div>
                    <div className="text-xl font-semibold">{mockReportData.devices.tablet}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="links" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Clicked Links</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {mockReportData.clickedLinks.map((link, index) => (
                    <li key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div className="break-all pr-4">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {link.url}
                        </a>
                      </div>
                      <div className="text-gray-600 font-medium whitespace-nowrap">
                        {link.clicks} clicks
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignReport;
