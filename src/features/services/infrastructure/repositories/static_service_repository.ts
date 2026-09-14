import { services } from '@/features/services/domain/entities/service';
import type { ServiceRepository } from '@/features/services/domain/repositories/service_repository';

export class StaticServiceRepository implements ServiceRepository {
  async getAll() {
    return services;
  }

  async getBySlug(slug: string) {
    return services.find((s) => s.slug === slug) ?? null;
  }
}
