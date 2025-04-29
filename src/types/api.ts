
/**
 * AuthUser interface
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  avatar_url?: string;
  role?: string;
  access_level?: 'free' | 'premium' | 'premium_plus';
  display_name?: string;
}

/**
 * API Error interface
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Generic Result type
 */
export type Result<T, E = ApiError> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Pagination response
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
