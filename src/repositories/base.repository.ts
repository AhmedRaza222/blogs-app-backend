import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { IBaseRepository } from './interfaces/base.repository.interface';

/**
 * Abstract base repository class providing common database operations.
 * 
 * @template T - The Mongoose Document type.
 */
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Creates a new document.
   * 
   * @param item - The data to create the document with.
   * @returns A promise that resolves to the created document.
   */
  async create(item: Partial<T>): Promise<T> {
    return this.model.create(item as any) as unknown as Promise<T>;
  }

  /**
   * Updates a document by its ID.
   * 
   * @param id - The ID of the document to update.
   * @param item - The update query to apply.
   * @returns A promise that resolves to the updated document, or null if not found.
   */
  async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  /**
   * Deletes a document by its ID.
   * 
   * @param id - The ID of the document to delete.
   * @returns A promise that resolves to true if deleted, false otherwise.
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  /**
   * Finds documents matching a filter.
   * 
   * @param filter - The filter query to matching documents.
   * @param options - Optional query options.
   * @returns A promise that resolves to an array of matching documents.
   */
  async find(filter: FilterQuery<T> = {}, options?: QueryOptions): Promise<T[]> {
      // Mongoose find returns a Query, which we can await directly or .exec()
    return this.model.find(filter, null, options).exec();
  }

  /**
   * Finds a single document by its ID.
   * 
   * @param id - The ID of the document to find.
   * @returns A promise that resolves to the found document, or null if not found.
   */
  async findOne(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  /**
   * Retrieves all documents in the collection.
   * 
   * @returns A promise that resolves to an array of all documents.
   */
  async findAll(): Promise<T[]> {
    return this.model.find({}).exec();
  }

  /**
   * Counts the number of documents matching a filter.
   * 
   * @param filter - The filter query.
   * @returns A promise that resolves to the count of matching documents.
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
