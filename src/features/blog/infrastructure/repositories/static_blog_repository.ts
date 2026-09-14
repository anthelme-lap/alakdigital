import { articles } from '@/features/blog/domain/entities/article';
import type { BlogRepository } from '@/features/blog/domain/repositories/blog_repository';

export class StaticBlogRepository implements BlogRepository {
  async getAll() {
    return articles;
  }

  async getBySlug(slug: string) {
    return articles.find((a) => a.slug === slug) ?? null;
  }

  async getByCategory(category: string) {
    return articles.filter((a) => a.category === category);
  }
}
