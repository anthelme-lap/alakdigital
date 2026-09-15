import { useContentStore } from '@/features/content/presentation/store/content_store';
import type { BlogRepository } from '@/features/blog/domain/repositories/blog_repository';

export class StaticBlogRepository implements BlogRepository {
  async getAll() {
    return useContentStore.getState().articles;
  }

  async getBySlug(slug: string) {
    return useContentStore.getState().articles.find((a) => a.slug === slug) ?? null;
  }

  async getByCategory(category: string) {
    return useContentStore.getState().articles.filter((a) => a.category === category);
  }
}
