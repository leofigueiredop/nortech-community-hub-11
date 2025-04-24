
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { MigrationFormData } from './types';

interface FileUploaderProps {
  form: UseFormReturn<MigrationFormData>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="memberList">Upload da lista de membros (opcional)</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 mb-2">
          Arraste um arquivo CSV ou clique para selecionar
        </p>
        <Input 
          id="memberList" 
          type="file" 
          accept=".csv,.xlsx" 
          className="hidden" 
          onChange={onFileChange}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => document.getElementById('memberList')?.click()}
          className="mt-2"
        >
          Selecionar arquivo
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Formatos aceitos: CSV. Tamanho máximo: 5MB.
      </p>
    </div>
  );
};

export default FileUploader;
