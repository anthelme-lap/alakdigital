import { apiClient } from '@/core/http/api_client';
import type { ArticleCategory } from '@/features/blog/domain/entities/article_category';

export async function fetchArticleCategories(): Promise<ArticleCategory[]> {
  return apiClient.get<ArticleCategory[]>('/article-categories');
}

export async function insertArticleCategory(payload: { name: string; slug: string }): Promise<ArticleCategory> {
  return apiClient.post<ArticleCategory>('/admin/article-categories', payload);
}

export async function updateArticleCategory(
  id: string,
  payload: Partial<{ name: string; slug: string }>,
): Promise<ArticleCategory> {
  return apiClient.put<ArticleCategory>(`/admin/article-categories/${id}`, payload);
}

export async function deleteArticleCategory(id: string): Promise<void> {
  await apiClient.delete(`/admin/article-categories/${id}`);
}
