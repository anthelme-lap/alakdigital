import type { BlogRepository } from '@/features/blog/domain/repositories/blog_repository';
import type { BlogArticle } from '@/features/blog/domain/entities/article';

export class GetArticles {
  constructor(private readonly repository: BlogRepository) {}

  execute(): Promise<BlogArticle[]> {
    return this.repository.getAll();
  }
}

export class GetArticleBySlug {
  constructor(private readonly repository: BlogRepository) {}

  execute(slug: string): Promise<BlogArticle | null> {
    return this.repository.getBySlug(slug);
  }
}

export class GetArticlesByCategory {
  constructor(private readonly repository: BlogRepository) {}

  execute(category: string): Promise<BlogArticle[]> {
    return this.repository.getByCategory(category);
  }
}
