
import { Discussion, DiscussionReply, DiscussionTopic } from '@/types/discussion';

export interface IDiscussionRepository {
  getAllTopics(): Promise<DiscussionTopic[]>;
  getDiscussionsByTopic(topicId: string): Promise<Discussion[]>;
  getDiscussion(id: string): Promise<Discussion>;
  createDiscussion(discussion: Partial<Discussion>): Promise<Discussion>;
  addReply(discussionId: string, reply: Partial<DiscussionReply>): Promise<DiscussionReply>;
}
