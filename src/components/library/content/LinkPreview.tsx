
import React from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface LinkPreviewProps {
  url: string;
  onProgress?: (progress: number) => void;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, onProgress }) => {
  React.useEffect(() => {
    // Quando o componente for montado, consideramos o progresso como 100%
    if (onProgress) {
      onProgress(100);
    }
  }, [onProgress]);

  // Extrair o domínio da URL para exibição
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  };

  const handleOpenLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink size={18} />
          <span>Link externo: {getDomain(url)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground mb-4">
          <p>Este conteúdo está hospedado em um site externo.</p>
          <p className="text-sm mt-2">URL: <span className="text-primary">{url}</span></p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleOpenLink} className="gap-2">
          <span>Abrir link</span>
          <ArrowUpRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LinkPreview;
