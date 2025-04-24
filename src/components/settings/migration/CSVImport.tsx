
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileType, Download, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CSVImport: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleImport = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive"
      });
      return;
    }
    
    // Show mapping dialog
    setShowMappingDialog(true);
  };
  
  const handleDownloadTemplate = () => {
    toast({
      title: "Template downloaded",
      description: "CSV template has been downloaded to your device."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Import via CSV</h3>
        <Button variant="outline" size="sm" className="gap-1" onClick={handleDownloadTemplate}>
          <Download className="h-3 w-3" />
          <span>Download Template</span>
        </Button>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {file ? file.name : "Drag a CSV file here or click to select"}
        </p>
        <Input 
          id="csvFile" 
          type="file" 
          accept=".csv,.xlsx" 
          className="hidden" 
          onChange={handleFileChange}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => document.getElementById('csvFile')?.click()}
          className="mt-2"
        >
          Select file
        </Button>
      </div>
      
      <Button 
        onClick={handleImport} 
        className="w-full mt-2" 
        disabled={!file}
      >
        Map Fields & Preview
      </Button>
      
      <p className="text-xs text-muted-foreground">
        Supported formats: CSV. Maximum size: 10MB.
      </p>
      
      {/* Field Mapping Dialog */}
      <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Map CSV Fields</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Match your CSV columns with the corresponding fields in Nortech.
            </p>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CSV Column</TableHead>
                    <TableHead>Maps to Nortech Field</TableHead>
                    <TableHead>Preview</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {['Name', 'Email', 'Role'].map((field) => (
                    <TableRow key={field}>
                      <TableCell className="font-medium">{field}</TableCell>
                      <TableCell>
                        <select className="w-full p-2 border rounded">
                          <option>{field.toLowerCase()}</option>
                          <option>Not imported</option>
                          <option>Custom field...</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {field === 'Name' ? 'John Doe' : 
                          field === 'Email' ? 'john@example.com' : 
                          field === 'Role' ? 'Member' : ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setShowMappingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Import started",
                  description: "Your data is being imported. You'll be notified when it's complete."
                });
                setShowMappingDialog(false);
              }}>
                Start Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CSVImport;
