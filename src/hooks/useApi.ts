import { api } from '@/api/ApiClient';

/**
 * Custom hook that provides convenient access to the API client instance and its repositories.
 * This hook returns a singleton instance of the API client, ensuring consistent state across the application.
 * 
 * @returns {Object} An object containing:
 *   - client: The core API client instance
 *   - auth: Authentication repository for user management
 *   - content: Content repository for managing library items
 *   - events: Events repository for managing community events
 *   - discussions: Discussions repository for managing community discussions
 *   - points: Points repository for managing user points and rewards
 *   - migration: Migration repository for data migrations
 *   - community: Community repository for managing community data
 *   - posts: Posts repository for managing community posts
 *   - getCurrentCommunityId: Function to get the current community context
 *   - setCurrentCommunity: Function to update the current community context
 */
export const useApi = () => {
  return {
    // Core client instance
    client: api,
    
    // Repository instances
    auth: api.auth,
    content: api.content,
    events: api.events,
    discussions: api.discussions,
    points: api.points,
    migration: api.migration,
    community: api.community,
    posts: api.posts,
    
    // Community context management
    getCurrentCommunityId: api.getCurrentCommunityId,
    setCurrentCommunity: api.setCurrentCommunity,
  };
};

export default useApi; 