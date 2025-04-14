
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FileUp, X, Check, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CSVUploaderProps {
  onUploadComplete: (data: Array<{email: string; name: string}>) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };
  
  const handleClearFile = () => {
    setFile(null);
    setFileName('');
  };
  
  const handleSubmit = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate file upload and processing
    setTimeout(() => {
      // Mock CSV parsing to get sample data
      const mockData = [
        { email: 'john@example.com', name: 'John Doe' },
        { email: 'jane@example.com', name: 'Jane Smith' },
        { email: 'bob@example.com', name: 'Bob Johnson' },
        { email: 'alice@example.com', name: 'Alice Williams' },
        { email: 'charlie@example.com', name: 'Charlie Brown' }
      ];
      
      onUploadComplete(mockData);
      setUploading(false);
      toast({
        title: "CSV Upload Complete",
        description: `Successfully imported ${mockData.length} attendees`,
      });
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Upload a CSV file with attendee information. The file should have columns for name and email.
        </p>
        
        <Card>
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              
              {!file ? (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileUp className="h-6 w-6 text-gray-500" />
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    
                    <label htmlFor="csv-upload">
                      <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="h-4 w-4 mr-2" />
                        Browse Files
                      </Button>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  
                  <p className="text-sm font-medium">{fileName}</p>
                  
                  <div className="flex gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleClearFile}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                    
                    <Button 
                      size="sm" 
                      onClick={handleSubmit}
                      disabled={uploading}
                    >
                      {uploading ? 'Importing...' : 'Import Attendees'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-2">CSV Format Example</h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs overflow-x-auto">
          name,email<br />
          John Doe,john@example.com<br />
          Jane Smith,jane@example.com
        </pre>
      </div>
    </div>
  );
};

export default CSVUploader;
