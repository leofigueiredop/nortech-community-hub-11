
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for migration history
const historyItems = [
  { 
    id: 1, 
    date: '2023-06-15', 
    type: 'Import', 
    platform: 'Discord', 
    status: 'completed',
    items: '156 members, 2,450 messages'
  },
  { 
    id: 2, 
    date: '2023-06-10', 
    type: 'Export', 
    platform: 'All Data', 
    status: 'completed',
    items: 'Full backup'
  },
  { 
    id: 3, 
    date: '2023-05-28', 
    type: 'Import', 
    platform: 'CSV', 
    status: 'failed',
    items: 'Format error at row 23'
  },
  { 
    id: 4, 
    date: '2023-05-15', 
    type: 'Export', 
    platform: 'Members Only', 
    status: 'processing',
    items: 'Generating...'
  }
];

const MigrationHistory: React.FC = () => {
  // If there's no history, show empty state
  if (historyItems.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <p>No migration history available yet.</p>
        <p className="text-sm mt-1">Your past import and export operations will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Source/Target</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.platform}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`gap-1 ${
                    item.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    item.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
                >
                  {item.status === 'completed' ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : item.status === 'failed' ? (
                    <AlertCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  <span className="capitalize">{item.status}</span>
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.items}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0" 
                  disabled={item.status !== 'completed'}
                >
                  <span className="sr-only">Download</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">View Logs</span>
                  <FileText className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MigrationHistory;
