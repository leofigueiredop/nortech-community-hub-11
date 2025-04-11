
export const getEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be/') 
      ? url.split('youtu.be/')[1].split('?')[0]
      : url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  }
  
  if (url.includes('vimeo.com')) {
    const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=0`;
  }
  
  if (url.includes('drive.google.com/file/d')) {
    const fileId = url.match(/\/d\/(.*?)\//) ? url.match(/\/d\/(.*?)\//)![1] : '';
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  if (url.includes('docs.google.com/document')) {
    return url.replace('/edit', '/preview');
  }
  
  if (url.includes('docs.google.com/presentation')) {
    return url.replace('/edit', '/embed');
  }
  
  if (url.includes('docs.google.com/spreadsheets')) {
    return url.replace('/edit', '/preview');
  }
  
  // For PDF files that are directly linked
  if (url.toLowerCase().endsWith('.pdf')) {
    // Some browsers support PDF embedding directly
    return url;
  }
  
  return url;
};

// Helper function to get filename from URL
export const getFilenameFromUrl = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split('/').pop() || 'file';
    return decodeURIComponent(filename);
  } catch (e) {
    // If the URL is invalid, just try to extract something reasonable
    const parts = url.split('/');
    return parts[parts.length - 1] || 'file';
  }
};

// Helper to check if a URL is embeddable
export const isEmbeddableUrl = (url: string): boolean => {
  return (
    url.includes('youtube.com') || 
    url.includes('youtu.be') || 
    url.includes('vimeo.com') || 
    url.includes('drive.google.com') || 
    url.includes('docs.google.com') ||
    url.toLowerCase().endsWith('.pdf')
  );
};
