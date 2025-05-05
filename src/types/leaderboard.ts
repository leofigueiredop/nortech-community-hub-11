// Add UUID type at the top
type UUID = string; // Type alias for UUID strings

export interface LeaderboardUser {
  id: UUID;
  name: string;
  avatar?: string;
  points: number;
  level: number;
} 