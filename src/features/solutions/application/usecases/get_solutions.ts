import type { SolutionRepository } from '@/features/solutions/domain/repositories/solution_repository';
import type { Solution } from '@/features/solutions/domain/entities/solution';

export class GetSolutions {
  constructor(private readonly repository: SolutionRepository) {}

  execute(): Promise<Solution[]> {
    return this.repository.getAll();
  }
}

export class GetSolutionBySlug {
  constructor(private readonly repository: SolutionRepository) {}

  execute(slug: string): Promise<Solution | null> {
    return this.repository.getBySlug(slug);
  }
}
