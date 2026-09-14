import type { ProjectRepository } from '@/features/projects/domain/repositories/project_repository';
import type { Project } from '@/features/projects/domain/entities/project';

export class GetProjects {
  constructor(private readonly repository: ProjectRepository) {}

  execute(): Promise<Project[]> {
    return this.repository.getAll();
  }
}

export class GetFeaturedProjects {
  constructor(private readonly repository: ProjectRepository) {}

  execute(): Promise<Project[]> {
    return this.repository.getFeatured();
  }
}

export class GetProjectBySlug {
  constructor(private readonly repository: ProjectRepository) {}

  execute(slug: string): Promise<Project | null> {
    return this.repository.getBySlug(slug);
  }
}
