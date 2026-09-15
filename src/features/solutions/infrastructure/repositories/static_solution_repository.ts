import { useContentStore } from '@/features/content/presentation/store/content_store';
import type { SolutionRepository } from '@/features/solutions/domain/repositories/solution_repository';

export class StaticSolutionRepository implements SolutionRepository {
  async getAll() {
    return useContentStore.getState().solutions;
  }

  async getBySlug(slug: string) {
    return useContentStore.getState().solutions.find((s) => s.slug === slug) ?? null;
  }
}
