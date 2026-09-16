import type { ServiceRepository } from '@/features/services/domain/repositories/ServiceRepository';
import type { Service } from '@/features/services/domain/entities/service';

export class GetServices {
  constructor(private readonly repository: ServiceRepository) {}

  execute(): Promise<Service[]> {
    return this.repository.getAll();
  }
}

export class GetServiceBySlug {
  constructor(private readonly repository: ServiceRepository) {}

  execute(slug: string): Promise<Service | null> {
    return this.repository.getBySlug(slug);
  }
}
