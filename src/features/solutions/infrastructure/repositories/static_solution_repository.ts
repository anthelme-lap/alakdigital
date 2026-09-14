import { solutions } from '@/features/solutions/domain/entities/solution';
import type { SolutionRepository } from '@/features/solutions/domain/repositories/solution_repository';

export class StaticSolutionRepository implements SolutionRepository {
  async getAll() {
    return solutions;
  }

  async getBySlug(slug: string) {
    return solutions.find((s) => s.slug === slug) ?? null;
  }
}
