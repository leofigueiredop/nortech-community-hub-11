export type AppError = {
  message: string;
  code: string;
  details?: Record<string, unknown>;
  cause?: unknown;
};