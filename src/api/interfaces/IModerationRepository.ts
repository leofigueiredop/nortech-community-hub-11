import { Result } from '@/types/result';
import { AppError } from '@/types/error';
import { ModerationAction, ModerationFlag } from '@/types/moderation';

export interface IModerationRepository {
  /**
   * Sets the current community context for moderation operations
   * @param communityId - The ID of the community
   */
  setCurrentCommunity(communityId: string): void;

  /**
   * Flags content for moderation review
   * @param contentId - ID of the content being flagged
   * @param contentType - Type of content ('post' or 'comment')
   * @param reason - Reason for flagging the content
   * @param reporterId - ID of the user reporting the content
   */
  flagContent(
    contentId: string,
    contentType: 'post' | 'comment',
    reason: string,
    reporterId: string
  ): Promise<Result<ModerationFlag, AppError>>;

  /**
   * Retrieves pending moderation flags for the current community
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   */
  getPendingFlags(
    page?: number,
    limit?: number
  ): Promise<Result<{ flags: ModerationFlag[]; total: number }, AppError>>;

  /**
   * Reviews and takes action on a flagged content
   * @param flagId - ID of the moderation flag
   * @param moderatorId - ID of the moderator reviewing the flag
   * @param action - Action to take on the flagged content
   */
  reviewFlag(
    flagId: string,
    moderatorId: string,
    action: ModerationAction
  ): Promise<Result<ModerationFlag, AppError>>;

  /**
   * Retrieves moderation history for the current community
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @param status - Optional filter by moderation status
   */
  getModerationHistory(
    page?: number,
    limit?: number,
    status?: 'reviewed' | 'resolved'
  ): Promise<Result<{ flags: ModerationFlag[]; total: number }, AppError>>;

  /**
   * Bans a user from the community
   * @param userId - ID of the user to ban
   * @param moderatorId - ID of the moderator issuing the ban
   * @param duration - Optional duration in days (undefined means permanent)
   * @param reason - Reason for the ban
   */
  banUser(
    userId: string,
    moderatorId: string,
    duration?: number,
    reason?: string
  ): Promise<Result<void, AppError>>;

  /**
   * Removes a user's ban from the community
   * @param userId - ID of the user to unban
   * @param moderatorId - ID of the moderator removing the ban
   */
  unbanUser(
    userId: string,
    moderatorId: string
  ): Promise<Result<void, AppError>>;

  /**
   * Checks if a user is currently banned from the community
   * @param userId - ID of the user to check
   */
  isUserBanned(
    userId: string
  ): Promise<Result<{ banned: boolean; expiry?: Date }, AppError>>;

  /**
   * Restores previously removed content
   * @param contentId - ID of the content to restore
   * @param contentType - Type of content ('post' or 'comment')
   * @param moderatorId - ID of the moderator restoring the content
   */
  restoreContent(
    contentId: string,
    contentType: 'post' | 'comment',
    moderatorId: string
  ): Promise<Result<void, AppError>>;
} 