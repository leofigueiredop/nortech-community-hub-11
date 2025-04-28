
import React, { useEffect } from 'react';

interface PdfViewerProps {
  url: string;
  onProgress?: (progress: number) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, onProgress }) => {
  // Simulação simples de progresso para PDF
  // Em um aplicativo real, você poderia acompanhar as páginas visualizadas
  useEffect(() => {
    // Inicia com 10% de progresso ao carregar
    if (onProgress) {
      onProgress(10);
    }

    // Após 5 segundos, assume 50% de progresso para simular leitura
    const timer1 = setTimeout(() => {
      if (onProgress) {
        onProgress(50);
      }
    }, 5000);

    // Após 15 segundos, considera como lido totalmente
    const timer2 = setTimeout(() => {
      if (onProgress) {
        onProgress(100);
      }
    }, 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onProgress]);

  return (
    <iframe 
      src={url} 
      className="w-full h-[80vh]"
      title="PDF Viewer"
    />
  );
};

export default PdfViewer;
