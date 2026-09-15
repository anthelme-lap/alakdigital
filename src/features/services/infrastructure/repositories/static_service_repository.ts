import { useContentStore } from '@/features/content/presentation/store/content_store';
import type { ServiceRepository } from '@/features/services/domain/repositories/service_repository';

export class StaticServiceRepository implements ServiceRepository {
  async getAll() {
    return useContentStore.getState().services;
  }

  async getBySlug(slug: string) {
    return useContentStore.getState().services.find((s) => s.slug === slug) ?? null;
  }
}
