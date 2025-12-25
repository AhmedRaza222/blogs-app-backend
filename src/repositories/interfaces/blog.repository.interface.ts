import { IBaseRepository } from './base.repository.interface';
import { IBlog } from '@/models/Blog';
import { Document } from 'mongoose';

export interface IBlogRepository extends IBaseRepository<IBlog & Document> {
    findByTags(tags: string[], page: number, limit: number): Promise<{ blogs: (IBlog & Document)[], total: number }>;
    findAllWithPagination(page: number, limit: number, filter?: any): Promise<{ blogs: (IBlog & Document)[], total: number }>;
}
