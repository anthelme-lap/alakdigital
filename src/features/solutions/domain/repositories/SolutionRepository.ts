import type { Solution } from '../entities/solution';

export interface SolutionRepository {
  getAll(): Promise<Solution[]>;
  getBySlug(slug: string): Promise<Solution | null>;
}
