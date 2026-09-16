import { apiClient } from '@/core/http/api_client';
import { NotFoundError } from '@/core/errors/app_error';
import type { Solution } from '@/features/solutions/domain/entities/solution';
import type { SolutionRepository } from '@/features/solutions/domain/repositories/SolutionRepository';

interface PaginatedResponse<T> {
  items: T[];
}

export class ApiSolutionRepository implements SolutionRepository {
  async getAll(): Promise<Solution[]> {
    const res = await apiClient.get<PaginatedResponse<Solution>>('/solutions?limit=0');
    return res.items;
  }

  async getBySlug(slug: string): Promise<Solution | null> {
    try {
      return await apiClient.get<Solution>(`/solutions/${slug}`);
    } catch (e) {
      if (e instanceof NotFoundError) return null;
      throw e;
    }
  }
}
