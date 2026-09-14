import { projects } from '@/features/projects/domain/entities/project';
import type { ProjectRepository } from '@/features/projects/domain/repositories/project_repository';

export class StaticProjectRepository implements ProjectRepository {
  async getAll() {
    return projects;
  }

  async getBySlug(slug: string) {
    return projects.find((p) => p.slug === slug) ?? null;
  }

  async getFeatured() {
    return projects.filter((p) => p.featured);
  }
}
