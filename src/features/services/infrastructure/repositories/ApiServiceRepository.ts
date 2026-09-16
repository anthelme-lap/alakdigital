import { apiClient } from '@/core/http/api_client';
import { NotFoundError } from '@/core/errors/app_error';
import type { Service } from '@/features/services/domain/entities/service';
import type { ServiceRepository } from '@/features/services/domain/repositories/ServiceRepository';

interface PaginatedResponse<T> {
  items: T[];
}

export class ApiServiceRepository implements ServiceRepository {
  async getAll(): Promise<Service[]> {
    const res = await apiClient.get<PaginatedResponse<Service>>('/services?limit=0');
    return res.items;
  }

  async getBySlug(slug: string): Promise<Service | null> {
    try {
      return await apiClient.get<Service>(`/services/${slug}`);
    } catch (e) {
      if (e instanceof NotFoundError) return null;
      throw e;
    }
  }
}
