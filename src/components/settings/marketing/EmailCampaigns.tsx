import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, FileText, Send, Trash } from 'lucide-react';
import CampaignWizard from './campaign/CampaignWizard';
import CampaignReport from './campaign/CampaignReport';
import { useToast } from '@/hooks/use-toast';
import MarketingWaitlistDialog from './MarketingWaitlistDialog';

// Mock data for campaigns
const mockCampaigns = [
  {
    id: '1',
    name: 'Monthly Newsletter - June',
    segment: 'All Members',
    status: 'sent',
    date: '2023-06-15',
    openRate: 68,
    clickRate: 24,
    bounceRate: 2
  },
  {
    id: '2',
    name: 'New Course Launch',
    segment: 'Course Subscribers',
    status: 'scheduled',
    date: '2023-06-28',
    openRate: null,
    clickRate: null,
    bounceRate: null
  },
  {
    id: '3',
    name: 'Community Update',
    segment: 'Active Members',
    status: 'draft',
    date: null,
    openRate: null,
    clickRate: null,
    bounceRate: null
  }
];

const EmailCampaigns: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const { toast } = useToast();
  
  const handleViewReport = (campaignId: string) => {
    setSelectedCampaign(campaignId);
    setShowReport(true);
  };
  
  const handleEdit = (campaignId: string) => {
    setSelectedCampaign(campaignId);
    setShowWizard(true);
  };

  const handleJoinWaitlist = () => {
    toast({
      title: "Waitlist Joined",
      description: "You'll be notified when email marketing features are available.",
    });
    setShowWaitlist(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Email Campaigns</h2>
        <Button onClick={() => setShowWaitlist(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Bounces</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.segment}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={campaign.status === 'sent' ? 'default' : 
                              campaign.status === 'scheduled' ? 'outline' : 'secondary'}
                      className={campaign.status === 'sent' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' : 
                              campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400' : 
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}
                    >
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.date || '—'}</TableCell>
                  <TableCell>{campaign.openRate !== null ? `${campaign.openRate}%` : '—'}</TableCell>
                  <TableCell>{campaign.clickRate !== null ? `${campaign.clickRate}%` : '—'}</TableCell>
                  <TableCell>{campaign.bounceRate !== null ? `${campaign.bounceRate}%` : '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(campaign.id)}
                        title="Edit Campaign"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      {campaign.status === 'sent' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewReport(campaign.id)}
                          title="View Report"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Report</span>
                        </Button>
                      )}
                      {campaign.status === 'sent' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title="Resend Campaign"
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Resend</span>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Delete Campaign"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Campaign Wizard Dialog */}
      {showWizard && (
        <CampaignWizard 
          campaignId={selectedCampaign}
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
        />
      )}
      
      {/* Campaign Report Dialog */}
      {showReport && (
        <CampaignReport 
          campaignId={selectedCampaign!}
          isOpen={showReport}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* Waitlist Dialog */}
      <MarketingWaitlistDialog 
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        onJoinWaitlist={handleJoinWaitlist}
      />
    </div>
  );
};

export default EmailCampaigns;
