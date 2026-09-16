import type { Project } from '../entities/project';

export interface ProjectRepository {
  getAll(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
  getFeatured(): Promise<Project[]>;
}
