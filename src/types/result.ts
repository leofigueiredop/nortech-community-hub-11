/**
 * A type representing either a successful result with data or an error
 */
export type Result<T, E> = {
  ok: boolean;
  data: T;
  error?: E;
} | {
  ok: boolean;
  data?: T;
  error: E;
}; 