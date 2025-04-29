import { AppError } from '@/types/error';
import { PostReaction, ReactionType } from '@/types/discussions';

export interface IPostReactionsRepository {
  setCurrentCommunity(communityId: string): void;
  addReaction(postId: string, userId: string, reactionType: ReactionType): Promise<AppError | null>;
  removeReaction(postId: string, userId: string): Promise<AppError | null>;
  getReactions(postId: string): Promise<{ data: PostReaction[] | null; error: AppError | null }>;
  getUserReaction(postId: string, userId: string): Promise<{ data: PostReaction | null; error: AppError | null }>;
} 