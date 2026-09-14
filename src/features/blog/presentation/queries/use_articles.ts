import { useQuery } from '@tanstack/react-query';
import { getArticles, getArticleBySlug } from '@/app/di';

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles.execute(),
  });
}

export function useArticleBySlug(slug: string) {
  return useQuery({
    queryKey: ['articles', slug],
    queryFn: () => getArticleBySlug.execute(slug),
    enabled: !!slug,
  });
}
