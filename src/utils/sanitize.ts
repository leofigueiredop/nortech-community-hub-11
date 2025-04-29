import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Initialize DOMPurify with a window object for Node.js environment
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param content - The HTML content to sanitize
 * @returns Sanitized HTML content
 */
export const sanitizeContent = (content: string): string => {
  if (!content) return '';
  
  // Configure DOMPurify options
  const options = {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code',
      'pre', 'hr', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: {
      html: true,
      svg: false,
      svgFilters: false,
      mathMl: false
    },
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  };

  // Add rel and target attributes to all links
  const clean = purify.sanitize(content, options);
  const dom = new JSDOM(clean);
  const { document } = dom.window;
  
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute('rel', 'noopener noreferrer');
    links[i].setAttribute('target', '_blank');
  }

  return document.body.innerHTML;
};

/**
 * Sanitizes plain text content
 * @param content - The text content to sanitize
 * @returns Sanitized text content
 */
export const sanitizeText = (content: string): string => {
  if (!content) return '';
  return content.replace(/[<>]/g, ''); // Remove < and > characters
}; 