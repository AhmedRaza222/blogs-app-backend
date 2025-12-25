import { BaseRepository } from './base.repository';
import Blog, { IBlog } from '@/models/Blog';
import { IBlogRepository } from './interfaces/blog.repository.interface';
import { Document, FilterQuery, UpdateQuery } from 'mongoose';

/**
 * Repository for Blog-specific database operations.
 * Extends BaseRepository to inherit common methods.
 */
export class BlogRepository extends BaseRepository<IBlog & Document> implements IBlogRepository {
  constructor() {
    super(Blog);
  }

  // Example of a specific custom method for Blog, keeping DB logic here
  /**
   * Finds blogs by tags with pagination.
   * 
   * @param tags - An array of tags to filter by.
   * @param page - The page number to retrieve.
   * @param limit - The number of blogs per page.
   * @returns A promise resolving to an object containing the list of blogs and the total count.
   */
  async findByTags(tags: string[], page: number, limit: number): Promise<{ blogs: (IBlog & Document)[], total: number }> {
      const query: FilterQuery<IBlog> = { tags: { $in: tags } };
      const skip = (page - 1) * limit;
      
      const blogs = await this.model.find(query)
        .populate('author')
        .skip(skip)
        .limit(limit)
        .sort({ created_date: -1 })
        .exec();
    
      const total = await this.model.countDocuments(query).exec();
      return { blogs: blogs as unknown as (IBlog & Document)[], total };
  }

  /**
   * Finds all blogs with pagination and an optional filter.
   * 
   * @param page - The page number to retrieve.
   * @param limit - The number of blogs per page.
   * @param filter - Optional filter query.
   * @returns A promise resolving to an object containing the list of blogs and the total count.
   */
  async findAllWithPagination(page: number, limit: number, filter: FilterQuery<IBlog> = {}): Promise<{ blogs: (IBlog & Document)[], total: number }> {
     const skip = (page - 1) * limit;
     const blogs = await this.model.find(filter)
        .populate('author')
        .skip(skip)
        .limit(limit)
        .sort({ created_date: -1 })
        .exec();

     const total = await this.model.countDocuments(filter).exec();
     return { blogs: blogs as unknown as (IBlog & Document)[], total };
  }

  // Override to ensure populate works
  /**
   * Updates a blog by ID and populates the author field.
   * Overrides the base update method to ensure author population on return.
   * 
   * @param id - The ID of the blog to update.
   * @param item - The update query.
   * @returns A promise resolving to the updated blog document, or null if not found.
   */
  async update(id: string, item: UpdateQuery<IBlog & Document>): Promise<(IBlog & Document) | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true }).populate('author').exec() as Promise<(IBlog & Document) | null>;
  }

  /**
   * Retrieves all unique tags from the blogs collection.
   * 
   * @returns A promise resolving to an array of unique tags.
   */
  async findAllTags(): Promise<string[]> {
    return this.model.distinct('tags').exec();
  }
}

export default new BlogRepository();
