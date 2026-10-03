export class ApiError extends Error {
  constructor(
    message: string,
    public code: 'VALIDATION' | 'CONFLICT' | 'STORAGE' | 'NOT_FOUND',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
