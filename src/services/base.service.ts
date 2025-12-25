import { IBaseRepository } from '@/repositories/interfaces/base.repository.interface';

export class BaseService<T> {
  protected repository: IBaseRepository<T>;

  constructor(repository: IBaseRepository<T>) {
    this.repository = repository;
  }

  async getAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<T | null> {
    return this.repository.findOne(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.repository.update(id, data);
  }

  async deleteById(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}

