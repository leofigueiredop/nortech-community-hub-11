
import { Post, PostComment, PostReaction } from '@/types/post';

export interface IPostRepository {
  getAll(page?: number, limit?: number): Promise<{ posts: Post[], total: number }>;
  getById(id: string): Promise<Post>;
  create(post: Partial<Post>): Promise<Post>;
  update(id: string, post: Partial<Post>): Promise<Post>;
  delete(id: string): Promise<void>;
  getFeaturedPosts(limit?: number): Promise<Post[]>;
  getPostsByUser(userId: string, limit?: number): Promise<Post[]>;
  addComment(postId: string, comment: Partial<PostComment>): Promise<PostComment>;
  getComments(postId: string): Promise<PostComment[]>;
  deleteComment(commentId: string): Promise<void>;
  addReaction(postId: string, userId: string, reactionType: string): Promise<PostReaction>;
  removeReaction(postId: string, userId: string): Promise<void>;
  getUserReaction(postId: string, userId: string): Promise<PostReaction | null>;
}
