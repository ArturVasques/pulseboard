export type AppErrorKind = 'NETWORK' | 'AUTH' | 'NOT_FOUND' | 'VALIDATION' | 'SERVER' | 'UNKNOWN';

export interface AppError {
  kind: AppErrorKind;
  message: string;
  status?: number;
  details?: unknown;
}