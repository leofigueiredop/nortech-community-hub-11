
import { z } from 'zod';

// Text formatting functions
export const formatFunctions = {
  bold: (text: string) => `**${text}**`,
  italic: (text: string) => `*${text}*`,
  strikethrough: (text: string) => `~~${text}~~`,
  list: () => '\n• List item\n• List item\n• List item\n',
  orderedList: () => '\n1. First item\n2. Second item\n3. Third item\n',
  quote: (text: string = 'Blockquote text') => `\n> ${text}\n`,
  divider: () => '\n---\n',
  code: (text: string = 'code block') => `\n\`\`\`\n${text}\n\`\`\`\n`,
  mention: (username: string = 'mention') => ` @${username} `,
  spoiler: (text: string = 'Spoiler content') => `\n||${text}||\n`,
  collapsible: (summary: string = 'Click to expand', content: string = 'Hidden content here') => 
    `\n<details>\n<summary>${summary}</summary>\n${content}\n</details>\n`,
  link: (text: string = 'link text', url: string = 'https://example.com') => `[${text}](${url})`,
  heading: (text: string = 'Heading', level: number = 2) => {
    const hashes = '#'.repeat(Math.min(level, 6));
    return `\n${hashes} ${text}\n`;
  }
};

// Text formatting with insertion into existing content
export const formatText = (content: string, format: string, selection: { start: number, end: number } = { start: 0, end: 0 }): string => {
  const selectedText = content.substring(selection.start, selection.end);
  let formattedText: string;
  let insertPosition: number;
  let cursorOffset: number = 0;

  switch (format) {
    case 'bold':
      formattedText = formatFunctions.bold(selectedText || 'bold text');
      break;
    case 'italic':
      formattedText = formatFunctions.italic(selectedText || 'italic text');
      break;
    case 'strikethrough':
      formattedText = formatFunctions.strikethrough(selectedText || 'strikethrough text');
      break;
    case 'list':
      formattedText = formatFunctions.list();
      break;
    case 'ordered-list':
      formattedText = formatFunctions.orderedList();
      break;
    case 'quote':
      formattedText = formatFunctions.quote(selectedText);
      break;
    case 'divider':
      formattedText = formatFunctions.divider();
      break;
    case 'code':
      formattedText = formatFunctions.code(selectedText);
      break;
    case 'mention':
      formattedText = formatFunctions.mention();
      break;
    case 'spoiler':
      formattedText = formatFunctions.spoiler(selectedText);
      break;
    case 'collapsible':
      formattedText = formatFunctions.collapsible();
      break;
    case 'link':
      formattedText = formatFunctions.link(selectedText);
      break;
    case 'heading':
      formattedText = formatFunctions.heading(selectedText);
      break;
    default:
      formattedText = selectedText;
      break;
  }

  if (selection.start === selection.end) {
    // No selection, just insert at cursor
    insertPosition = selection.start;
    return content.substring(0, insertPosition) + formattedText + content.substring(insertPosition);
  } else {
    // Replace selected text with formatted text
    return content.substring(0, selection.start) + formattedText + content.substring(selection.end);
  }
};

// Post validation schema
export const postSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Post content is required"),
  space: z.string().min(1, "Please select a space to post in"),
  postType: z.string(),
  visibility: z.string(),
  tags: z.array(z.string()),
  monetization: z.object({
    usePoints: z.boolean(),
    pointsAmount: z.number().min(1).optional(),
    storeItem: z.string().nullable(),
    premiumGroup: z.string().nullable(),
  }),
  scheduling: z.object({
    isScheduled: z.boolean(),
    scheduledDate: z.date().nullable(),
    scheduledTime: z.string().nullable(),
  }).refine(data => {
    // If scheduled, both date and time must be present
    return !data.isScheduled || (data.scheduledDate !== null && data.scheduledTime !== null);
  }, {
    message: "Both date and time are required for scheduled posts",
    path: ["scheduledDate"],
  }),
  attachments: z.array(z.string()),
  embeds: z.array(z.object({
    type: z.string(),
    url: z.string().url("Please enter a valid URL"),
  })),
  poll: z.object({
    question: z.string(),
    options: z.array(z.string()).min(2, "At least 2 options are required"),
    allowSeeResults: z.boolean(),
    endDate: z.string().nullable(),
  }).nullable(),
});

export type PostFormData = z.infer<typeof postSchema>;

// Validate the post data
export const validatePost = (postData: any): { valid: boolean; errors: Record<string, string> } => {
  try {
    postSchema.parse(postData);
    return { valid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: { general: 'Invalid post data' } };
  }
};

// Extract URLs from text content for potential embedding
export const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

// Detect embed type from URL
export const detectEmbedType = (url: string): string => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('loom.com')) {
    return 'loom';
  } else if (url.includes('vimeo.com')) {
    return 'vimeo';
  } else if (url.includes('twitter.com') || url.includes('x.com')) {
    return 'twitter';
  } else {
    return 'link';
  }
};

// Estimate reading time of content
export const estimateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// Check for potential sensitive content
export const checkSensitiveContent = (content: string): boolean => {
  const sensitiveWords = [
    'password', 'credit card', 'social security', 'ssn', 'private', 'confidential'
  ];
  
  return sensitiveWords.some(word => 
    content.toLowerCase().includes(word.toLowerCase())
  );
};

// Helper for getting icon names based on post type and visibility
export const getPostTypeIcon = (postType: string): string => {
  switch (postType) {
    case 'standard':
      return 'FileText';
    case 'event':
      return 'Calendar';
    case 'question':
      return 'MessageSquare';
    case 'resource':
      return 'FileVideo';
    case 'paid':
      return 'DollarSign';
    default:
      return 'FileText';
  }
};

export const getVisibilityIcon = (visibilityOption: string): string => {
  switch (visibilityOption) {
    case 'free':
      return 'Eye';
    case 'premium':
      return 'Lock';
    case 'teaser':
      return 'Layers';
    default:
      return 'Eye';
  }
};
