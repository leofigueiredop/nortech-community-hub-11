export interface Space {
  id: string;
  name: string;
  description: string;
  type: 'forum' | 'qa' | 'feed' | 'course' | 'project';
  icon: string;
  color: string;
  isPrivate: boolean;
  memberCount: number;
  isActive: boolean;
  template?: string;
  isSoon?: boolean;
}

export interface SpaceTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  defaultSettings: Record<string, any>;
}

export interface SpaceCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
} 