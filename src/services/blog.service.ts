import { BaseService } from './base.service';
import { IBlog } from '@/models/Blog';
import blogRepository from '@/repositories/blog.repository';
import { IBlogRepository } from '@/repositories/interfaces/blog.repository.interface';
import { Document } from 'mongoose';

export class BlogService extends BaseService<IBlog & Document> {
  private blogRepository: IBlogRepository;

  constructor() {
    super(blogRepository);
    this.blogRepository = blogRepository;
  }

  async getBlogsWithPagination(
    page: number = 1,
    limit: number = 10,
    tags?: string | string[],
    search?: string
  ): Promise<{ data: (IBlog & Document)[]; pagination: any }> {
    const filter: any = {};

    if (tags) {
      const tagList = Array.isArray(tags) ? tags : (tags as string).split(',').map((tag) => tag.trim());
      filter.tags = { $in: tagList };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const result = await this.blogRepository.findAllWithPagination(page, limit, filter);

    const { blogs, total } = result;

    return {
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Override to use specific repository method if needed, or rely on base
  async updateBlog(id: string, data: Partial<IBlog>): Promise<(IBlog & Document) | null> {
      return this.blogRepository.update(id, data);
  }

  async getAllTags(): Promise<string[]> {
    // Cast to any because the interface might not have updated yet (if strictly typed)
    // or just assume standard repository pattern
    // In this specific setup, we know BlogRepository has it
    return (this.blogRepository as any).findAllTags();
  }
}

export default new BlogService();

