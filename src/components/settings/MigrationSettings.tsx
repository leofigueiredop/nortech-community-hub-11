
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, FileType, HelpCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import MigrationHistory from './migration/MigrationHistory';
import CSVImport from './migration/CSVImport';
import SupportCTA from './migration/SupportCTA';

const MigrationSettings: React.FC = () => {
  const { toast } = useToast();
  const [selectedExportOptions, setSelectedExportOptions] = useState({
    members: true,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    const selectedOptions = Object.entries(selectedExportOptions)
      .filter(([_, isSelected]) => isSelected)
      .map(([option]) => option);
      
    if (selectedOptions.length === 0) {
      toast({
        title: "No options selected",
        description: "Please select at least one data type to export",
        variant: "destructive"
      });
      return;
    }
    
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export generated successfully",
        description: "Your export is ready to download. Link will be available for 24 hours.",
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Data Migration</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Import data from other platforms or export your community data.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={18} />
              Import Data
            </CardTitle>
            <CardDescription>
              Bring your existing community data into Nortech from other platforms.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <CSVImport />
            
            <div className="bg-slate-50 dark:bg-slate-900 p-4 mt-6 rounded-lg">
              <SupportCTA />
            </div>
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
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Export Options</h3>
                <Button 
                  variant="link" 
                  className="text-xs p-0 h-auto" 
                  onClick={() => setSelectedExportOptions({
                    members: true
                  })}
                >
                  Select all
                </Button>
              </div>
              
              <div className="grid gap-3">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="members" 
                    checked={selectedExportOptions.members}
                    onCheckedChange={(checked) => 
                      setSelectedExportOptions(prev => ({ ...prev, members: !!checked }))
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="members" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Member profiles
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleExport} 
              className="w-full"
              disabled={isExporting}
            >
              {isExporting ? "Generating Export..." : "Generate Export"}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Export files are available for download for 24 hours.
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-900 p-4 mt-4 rounded-lg">
              <SupportCTA />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileType size={18} />
            Migration History
          </CardTitle>
          <CardDescription>
            View your past data import and export operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MigrationHistory />
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationSettings;
