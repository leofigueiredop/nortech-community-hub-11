
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Edit, MessageCircle, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AffiliateDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affiliate: {
    id: string;
    name: string;
    email: string;
  };
}

const AffiliateDetailsDialog: React.FC<AffiliateDetailsDialogProps> = ({
  open,
  onOpenChange,
  affiliate,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [confirmSuspend, setConfirmSuspend] = useState(false);

  const affiliateLink = `https://yoursite.com/ref/${affiliate.id}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              {affiliate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span>{affiliate.name}</span>
            <span className="ml-2 text-sm font-normal text-gray-500">({affiliate.email})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit size={16} /> Edit Details
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MessageCircle size={16} /> Message
          </Button>
          {!confirmSuspend ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => setConfirmSuspend(true)}
            >
              Suspend Affiliate
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xs">Confirm suspension:</span>
              <Button 
                variant="destructive" 
                size="sm"
              >
                Confirm
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setConfirmSuspend(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
          <div>
            <div className="text-sm font-medium">Referral Link</div>
            <div className="text-xs text-gray-500 truncate max-w-[300px] md:max-w-[500px]">
              {affiliateLink}
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => copyToClipboard(affiliateLink)}
            className="flex items-center gap-1"
          >
            <Copy size={14} /> Copy
          </Button>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Performance</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-r pr-2">
                      <div className="text-xs text-gray-500">Referrals</div>
                      <div className="text-2xl font-semibold">42</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Conversion Rate</div>
                      <div className="text-2xl font-semibold">18.3%</div>
                    </div>
                    <div className="border-r border-t pt-2 pr-2">
                      <div className="text-xs text-gray-500">Total Earnings</div>
                      <div className="text-2xl font-semibold">$1,248.00</div>
                    </div>
                    <div className="border-t pt-2">
                      <div className="text-xs text-gray-500">Tier</div>
                      <div className="text-xl font-semibold flex items-center">
                        <span className="text-amber-500">Gold</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="text-sm">Affiliate since</div>
                      <div className="text-sm font-medium">Mar 15, 2025</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm">Status</div>
                      <div className="text-sm font-medium px-2 bg-green-100 text-green-800 rounded-full">Active</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm">Custom commission</div>
                      <div className="text-sm font-medium text-purple-600">Yes (35% / 20%)</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm">Payment method</div>
                      <div className="text-sm font-medium">PayPal</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">New referral: Sarah Johnson</div>
                      <div className="text-xs text-gray-500">Subscription: Premium Monthly ($29.99)</div>
                    </div>
                    <div className="text-sm text-gray-500">Apr 20, 2025</div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">Commission paid: $189.50</div>
                      <div className="text-xs text-gray-500">Via PayPal</div>
                    </div>
                    <div className="text-sm text-gray-500">Apr 15, 2025</div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">New referral: Michael Brown</div>
                      <div className="text-xs text-gray-500">Subscription: Annual Pro ($249.00)</div>
                    </div>
                    <div className="text-sm text-gray-500">Apr 10, 2025</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="referrals" className="mt-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Commission</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>Apr 20, 2025</TableCell>
                        <TableCell>Premium Monthly</TableCell>
                        <TableCell>$29.99</TableCell>
                        <TableCell>$9.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Michael Brown</TableCell>
                        <TableCell>Apr 10, 2025</TableCell>
                        <TableCell>Annual Pro</TableCell>
                        <TableCell>$249.00</TableCell>
                        <TableCell>$75.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Emma Wilson</TableCell>
                        <TableCell>Apr 5, 2025</TableCell>
                        <TableCell>Premium Monthly</TableCell>
                        <TableCell>$29.99</TableCell>
                        <TableCell>$9.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>James Taylor</TableCell>
                        <TableCell>Mar 28, 2025</TableCell>
                        <TableCell>Annual Basic</TableCell>
                        <TableCell>$119.00</TableCell>
                        <TableCell>$36.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments" className="mt-4">
            <Card>
              <CardHeader className="py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Payment History</CardTitle>
                <div className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  Next payout: May 1, 2025
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Apr 15, 2025</TableCell>
                        <TableCell className="font-medium">$189.50</TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell>
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full inline-block">
                            Completed
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 text-xs">
                          PAY-1234567890
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Mar 15, 2025</TableCell>
                        <TableCell className="font-medium">$155.75</TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell>
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full inline-block">
                            Completed
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 text-xs">
                          PAY-0987654321
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Feb 15, 2025</TableCell>
                        <TableCell className="font-medium">$102.25</TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell>
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full inline-block">
                            Completed
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 text-xs">
                          PAY-5678901234
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Current Balance</div>
                    <div className="text-xl font-semibold">$98.50</div>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Process Payout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AffiliateDetailsDialog;
