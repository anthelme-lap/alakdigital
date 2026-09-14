import { useQuery } from '@tanstack/react-query';
import { getSolutions, getSolutionBySlug } from '@/app/di';

export function useSolutions() {
  return useQuery({
    queryKey: ['solutions'],
    queryFn: () => getSolutions.execute(),
  });
}

export function useSolutionBySlug(slug: string) {
  return useQuery({
    queryKey: ['solutions', slug],
    queryFn: () => getSolutionBySlug.execute(slug),
    enabled: !!slug,
  });
}
