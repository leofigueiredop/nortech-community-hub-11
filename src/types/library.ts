export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  resourceUrl: string;
  format: string;
  tags: string[];
  views: number;
  duration?: string;
  accessLevel: 'free' | 'premium';
  featured?: boolean;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for premium content
  pointsEnabled?: boolean;
  pointsValue?: number;
  freeAccessesLeft?: number;
  exclusiveToPlan?: string;
}
