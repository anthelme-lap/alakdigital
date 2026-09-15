import { fetchSolutions, fetchSolutionBySlug } from '@/features/content/infrastructure/content_api';
import type { SolutionRepository } from '@/features/solutions/domain/repositories/solution_repository';

export class StaticSolutionRepository implements SolutionRepository {
  async getAll() {
    return fetchSolutions();
  }

  async getBySlug(slug: string) {
    return fetchSolutionBySlug(slug);
  }
}
