export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Erreur réseau. Vérifiez votre connexion.', details?: unknown) {
    super('NETWORK_ERROR', message, undefined, details);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Données invalides.', details?: unknown) {
    super('VALIDATION_ERROR', message, 422, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Ressource', details?: unknown) {
    super('NOT_FOUND', `${resource} introuvable.`, 404, details);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentification requise.', details?: unknown) {
    super('UNAUTHORIZED', message, 401, details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Accès refusé.', details?: unknown) {
    super('FORBIDDEN', message, 403, details);
    this.name = 'ForbiddenError';
  }
}

export class ServerError extends AppError {
  constructor(message = 'Erreur serveur. Réessayez plus tard.', details?: unknown) {
    super('SERVER_ERROR', message, 500, details);
    this.name = 'ServerError';
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) return new NetworkError(error.message);
  return new NetworkError('Une erreur inattendue est survenue.');
}
