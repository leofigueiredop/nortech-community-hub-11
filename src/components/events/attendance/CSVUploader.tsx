
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileSpreadsheet, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CSVUploaderProps {
  onUploadComplete: (data: Array<{email: string; name: string}>) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file');
        return;
      }
      setFile(selectedFile);
    }
  };
  
  const parseCSV = (text: string) => {
    try {
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      // Check if required columns exist
      if (!headers.includes('email')) {
        throw new Error('CSV must contain an "email" column');
      }
      
      const results = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const entry: any = {};
        
        headers.forEach((header, index) => {
          entry[header.trim()] = values[index]?.trim() || '';
        });
        
        // If name is missing, use email as name
        if (!entry.name) {
          entry.name = entry.email.split('@')[0];
        }
        
        results.push(entry);
      }
      
      return results;
    } catch (err: any) {
      throw new Error(`Error parsing CSV: ${err.message}`);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      if (data.length === 0) {
        throw new Error('No valid data found in the CSV file');
      }
      
      onUploadComplete(data);
      setFile(null);
      
    } catch (err: any) {
      setError(err.message || 'Error processing the CSV file');
      toast({
        title: "Upload Failed",
        description: err.message || 'Error processing the CSV file',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="border-dashed border-2 py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <FileSpreadsheet size={40} className="text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-medium">{file ? file.name : 'Upload Attendance CSV'}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {file 
                ? `${(file.size / 1024).toFixed(2)} KB - CSV file ready to process` 
                : 'Drag and drop or click to upload a CSV file'}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Input 
              id="csv-upload" 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileChange}
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('csv-upload')?.click()}
              disabled={loading}
            >
              Select File
            </Button>
            
            <Button 
              onClick={handleUpload} 
              disabled={!file || loading}
              className="gap-2"
            >
              <Upload size={16} />
              {loading ? 'Processing...' : 'Upload and Process'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CSVUploader;
