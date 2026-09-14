import {
  AppError,
  NetworkError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
} from '@/core/errors/app_error';

export function parseApiError(status: number, message?: string): AppError {
  const msg = message ?? 'Une erreur est survenue.';
  switch (status) {
    case 401:
      return new UnauthorizedError(msg);
    case 403:
      return new ForbiddenError(msg);
    case 404:
      return new NotFoundError('Ressource');
    case 422:
      return new ValidationError(msg);
    case 500:
    case 502:
    case 503:
      return new ServerError(msg);
    default:
      if (status >= 400 && status < 500) return new ValidationError(msg);
      return new ServerError(msg);
  }
}

export { NetworkError };
