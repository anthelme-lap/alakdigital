import { fetchServices, fetchServiceBySlug } from '@/features/content/infrastructure/content_api';
import type { ServiceRepository } from '@/features/services/domain/repositories/service_repository';

export class StaticServiceRepository implements ServiceRepository {
  async getAll() {
    return fetchServices();
  }

  async getBySlug(slug: string) {
    return fetchServiceBySlug(slug);
  }
}
