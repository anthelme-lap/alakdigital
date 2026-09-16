import { apiClient } from '@/core/http/api_client';
import { NotFoundError } from '@/core/errors/app_error';
import type { BlogArticle } from '@/features/blog/domain/entities/article';
import type { BlogRepository } from '@/features/blog/domain/repositories/BlogRepository';

interface PaginatedResponse<T> {
  items: T[];
}

type ArticleResponse = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  author_role: string;
  author_bio: string;
  date: string;
  reading_time: string;
  cover_image: string;
  featured: boolean;
  content: string;
  tags: string[];
};

function mapArticle(r: ArticleResponse): BlogArticle {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    category: r.category,
    author: r.author,
    authorRole: r.author_role,
    authorBio: r.author_bio,
    date: r.date,
    readingTime: r.reading_time,
    coverImage: r.cover_image,
    featured: r.featured,
    content: r.content,
    tags: r.tags,
  };
}

export class ApiBlogRepository implements BlogRepository {
  async getAll(): Promise<BlogArticle[]> {
    const res = await apiClient.get<PaginatedResponse<ArticleResponse>>('/articles?limit=0');
    return res.items.map(mapArticle);
  }

  async getBySlug(slug: string): Promise<BlogArticle | null> {
    try {
      const article = await apiClient.get<ArticleResponse>(`/articles/${slug}`);
      return mapArticle(article);
    } catch (e) {
      if (e instanceof NotFoundError) return null;
      throw e;
    }
  }

  async getByCategory(category: string): Promise<BlogArticle[]> {
    const articles = await this.getAll();
    return articles.filter((a) => a.category === category);
  }
}
