import { apiClient } from '@/core/http/api_client';
import { NotFoundError } from '@/core/errors/app_error';
import type { Project } from '@/features/projects/domain/entities/project';
import type { ProjectRepository } from '@/features/projects/domain/repositories/ProjectRepository';

interface PaginatedResponse<T> {
  items: T[];
}

export class ApiProjectRepository implements ProjectRepository {
  async getAll(): Promise<Project[]> {
    const res = await apiClient.get<PaginatedResponse<Project>>('/projects?limit=0');
    return res.items;
  }

  async getBySlug(slug: string): Promise<Project | null> {
    try {
      return await apiClient.get<Project>(`/projects/${slug}`);
    } catch (e) {
      if (e instanceof NotFoundError) return null;
      throw e;
    }
  }

  async getFeatured(): Promise<Project[]> {
    const all = await this.getAll();
    return all.filter((p) => p.featured);
  }
}
