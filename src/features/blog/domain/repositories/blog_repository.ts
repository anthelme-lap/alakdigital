import type { BlogArticle } from '../entities/article';

export interface BlogRepository {
  getAll(): Promise<BlogArticle[]>;
  getBySlug(slug: string): Promise<BlogArticle | null>;
  getByCategory(category: string): Promise<BlogArticle[]>;
}
