import { useQuery } from '@tanstack/react-query';
import { getServices, getServiceBySlug } from '@/app/di';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => getServices.execute(),
  });
}

export function useServiceBySlug(slug: string) {
  return useQuery({
    queryKey: ['services', slug],
    queryFn: () => getServiceBySlug.execute(slug),
    enabled: !!slug,
  });
}
