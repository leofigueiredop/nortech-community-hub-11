
import { ContentItem } from '@/types/library';
import { toast } from '@/hooks/use-toast';

// Handle external content access
export const handleExternalContentAccess = (
  item: ContentItem | null, 
  onContentView: () => void
) => {
  if (!item) return;
  
  // Log access attempt
  console.log(`Accessing external content: ${item.title}`);
  
  // Call the content view handler
  onContentView();
  
  // Based on format, perform different actions
  switch (item.format) {
    case 'pdf':
    case 'image':
      if (item.resourceUrl) {
        window.open(item.resourceUrl, '_blank');
      } else {
        toast({
          title: "Recurso não disponível",
          description: "O URL do recurso não está disponível para este conteúdo.",
          variant: "destructive",
        });
      }
      break;
      
    case 'link':
    case 'url':
      if (item.resourceUrl) {
        window.open(item.resourceUrl, '_blank');
      } else {
        toast({
          title: "Link não disponível",
          description: "O link não está disponível para este conteúdo.",
          variant: "destructive",
        });
      }
      break;
      
    default:
      // For other formats, just track the view
      toast({
        title: "Conteúdo acessado",
        description: "Você está visualizando este conteúdo.",
      });
      break;
  }
};

// Format duration from seconds to readable format
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0 sec';
  
  if (seconds < 60) {
    return `${seconds} seg`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

// Get content type name
export const getContentTypeName = (format: string): string => {
  if (!format) return 'Desconhecido';
  
  const formatMap: Record<string, string> = {
    'video': 'Vídeo',
    'audio': 'Áudio',
    'pdf': 'PDF',
    'text': 'Artigo',
    'url': 'Link Web',
    'youtube': 'YouTube',
    'vimeo': 'Vimeo',
    'gdoc': 'Google Doc',
    'image': 'Imagem',
    'course': 'Curso',
    'link': 'Link'
  };
  
  return formatMap[format] || 'Desconhecido';
};

// Function to get content duration
export const getContentDuration = (seconds: number): string => {
  return formatDuration(seconds || 0);
};

// Function to get completion criteria
export const getCompletionCriteria = (item: ContentItem): string => {
  if (item.completionCriteria) {
    return item.completionCriteria;
  }
  
  // Generate default completion criteria based on content format
  switch (item.format) {
    case 'video':
    case 'youtube':
    case 'vimeo':
      return 'Assistir 90% do vídeo';
    case 'audio':
      return 'Ouvir o áudio completo';
    case 'pdf':
    case 'text':
    case 'gdoc':
      return 'Ler o documento';
    case 'course':
      return 'Completar todos os módulos';
    default:
      return 'Visualizar o conteúdo completo';
  }
};

// Safe way to check if a tag exists in an item
export const hasTag = (item: ContentItem, tag: string): boolean => {
  if (!item.tags || !Array.isArray(item.tags)) {
    return false;
  }
  return item.tags.includes(tag);
};
