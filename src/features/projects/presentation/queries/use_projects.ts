import { useQuery } from '@tanstack/react-query';
import { getProjects, getFeaturedProjects, getProjectBySlug } from '@/app/di';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects.execute(),
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => getFeaturedProjects.execute(),
  });
}

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: () => getProjectBySlug.execute(slug),
    enabled: !!slug,
  });
}
