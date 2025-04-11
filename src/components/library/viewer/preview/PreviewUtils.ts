
export const getEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be/') 
      ? url.split('youtu.be/')[1].split('?')[0]
      : url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  if (url.includes('vimeo.com')) {
    const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
    return `https://player.vimeo.com/video/${vimeoId}`;
  }
  
  if (url.includes('drive.google.com/file/d')) {
    const fileId = url.match(/\/d\/(.*?)\//) ? url.match(/\/d\/(.*?)\//)![1] : '';
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  if (url.includes('docs.google.com/document')) {
    return url.replace('/edit', '/preview');
  }
  
  return url;
};
