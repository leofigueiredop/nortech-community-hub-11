
import React from 'react';

interface PdfViewerProps {
  url: string;
  onProgress?: (progress: number) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  return (
    <iframe 
      src={url} 
      className="w-full h-[80vh]"
      title="PDF Viewer"
    />
  );
};

export default PdfViewer;
