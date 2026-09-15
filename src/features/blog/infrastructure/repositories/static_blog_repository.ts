import { fetchArticles, fetchArticleBySlug } from '@/features/content/infrastructure/content_api';
import type { BlogRepository } from '@/features/blog/domain/repositories/blog_repository';

export class StaticBlogRepository implements BlogRepository {
  async getAll() {
    return fetchArticles();
  }

  async getBySlug(slug: string) {
    return fetchArticleBySlug(slug);
  }

  async getByCategory(category: string) {
    const articles = await fetchArticles();
    return articles.filter((a) => a.category === category);
  }
}
