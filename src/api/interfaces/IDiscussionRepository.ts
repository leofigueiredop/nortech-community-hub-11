import { Discussion, DiscussionReply, DiscussionTopic } from '@/types/discussion';

export interface IDiscussionRepository {
  getAllTopics(): Promise<DiscussionTopic[]>;
  getTopicById(id: string): Promise<DiscussionTopic>;
  createTopic(topic: Partial<DiscussionTopic>): Promise<DiscussionTopic>;
  updateTopic(id: string, topic: Partial<DiscussionTopic>): Promise<DiscussionTopic>;
  deleteTopic(id: string): Promise<void>;
  getDiscussionsByTopic(topicId: string): Promise<Discussion[]>;
  getDiscussion(id: string): Promise<Discussion>;
  createDiscussion(discussion: Partial<Discussion>): Promise<Discussion>;
  updateDiscussion(id: string, discussion: Partial<Discussion>): Promise<Discussion>;
  deleteDiscussion(id: string): Promise<void>;
  addReply(discussionId: string, reply: Partial<DiscussionReply>): Promise<DiscussionReply>;
  updateReply(id: string, reply: Partial<DiscussionReply>): Promise<DiscussionReply>;
  deleteReply(id: string): Promise<void>;
  markReplyAsSolution(replyId: string): Promise<DiscussionReply>;
  incrementViewCount(discussionId: string): Promise<void>;
  upvoteDiscussion(id: string, isUpvoted: boolean): Promise<boolean>;
  getDiscussionUpvotes(discussionId: string): Promise<string[]>;
  checkUserUpvoted(discussionId: string, userId: string): Promise<boolean>;
}
