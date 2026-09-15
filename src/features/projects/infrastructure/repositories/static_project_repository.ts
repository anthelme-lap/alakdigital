import { useContentStore } from '@/features/content/presentation/store/content_store';
import type { ProjectRepository } from '@/features/projects/domain/repositories/project_repository';

export class StaticProjectRepository implements ProjectRepository {
  async getAll() {
    return useContentStore.getState().projects;
  }

  async getBySlug(slug: string) {
    return useContentStore.getState().projects.find((p) => p.slug === slug) ?? null;
  }

  async getFeatured() {
    return useContentStore.getState().projects.filter((p) => p.featured);
  }
}
