
export type AIFeatureStatus = 'active' | 'disabled' | 'coming-soon';

export interface AIFeature {
  id: string;
  title: string;
  description: string;
  status: AIFeatureStatus;
  icon: React.ReactNode;
}

export interface MatchSuggestion {
  user1: string;
  user2: string;
  commonCourses: number;
  commonDiscussions: number;
  topics: string[];
}

export interface ContentSuggestion {
  type: 'poll' | 'tip' | 'icebreaker' | 'qa';
  title: string;
  description: string;
  preview: string;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'coming-soon';
}
