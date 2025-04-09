
import React from 'react';
import { useRedemptionHistory } from '@/hooks/useRedemptionHistory';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, ExternalLink, Download } from 'lucide-react';

const RedemptionHistory: React.FC = () => {
  const { redemptions, isLoading } = useRedemptionHistory();

  if (isLoading) {
    return <div className="text-center py-10">Loading history...</div>;
  }

  if (redemptions.length === 0) {
    return (
      <div className="text-center py-10 space-y-4">
        <Gift className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-medium">No redemptions yet</h3>
        <p className="text-muted-foreground">Start redeeming rewards to see your history here</p>
      </div>
    );
  }

  const getActionButton = (redemption: any) => {
    switch (redemption.reward.type) {
      case 'downloadable':
        return (
          <Button size="sm" variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        );
      case 'access':
      case 'nft':
        return (
          <Button size="sm" variant="outline" className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-1" /> Access
          </Button>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Processing</Badge>;
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Points Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {redemptions.map((redemption) => (
              <TableRow key={redemption.id}>
                <TableCell className="font-medium">
                  {new Date(redemption.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{redemption.reward.title}</TableCell>
                <TableCell>{redemption.pointsSpent}</TableCell>
                <TableCell>{getStatusBadge(redemption.status)}</TableCell>
                <TableCell className="text-right">
                  {getActionButton(redemption)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RedemptionHistory;
