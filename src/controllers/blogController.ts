import { Request, Response } from 'express';
import blogService from '@/services/blog.service';

// GET /api/blogs?page={page}&limit={limit}&tags={tag}
/**
 * Retrieves a paginated list of blogs, optionally filtered by tags.
 * 
 * @param req - Express Request object containing query parameters: page, limit, and tags.
 * @param reqRes - Express Response object used to send the response.
 * @returns A promise that resolves to void.
 */
export const getBlogs = async (req: Request, reqRes: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tags = req.query.tags as string | string[] | undefined;
    const search = req.query.search as string | undefined;

    const result = await blogService.getBlogsWithPagination(page, limit, tags, search);

    reqRes.json(result);
  } catch (error) {
    console.error('Error in getBlogs:', error);
    reqRes.status(500).json({ message: 'Server Error', error });
  }
};

// GET /api/blogs/tags
/**
 * Retrieves all unique tags used in blogs.
 * 
 * @param req - Express Request object.
 * @param reqRes - Express Response object.
 * @returns A promise that resolves to void.
 */
export const getTags = async (req: Request, reqRes: Response): Promise<void> => {
  try {
    const tags = await blogService.getAllTags();
    reqRes.json({ tags });
  } catch (error) {
    console.error('Error in getTags:', error);
    reqRes.status(500).json({ message: 'Server Error', error });
  }
};

// PUT /api/blogs/:id
/**
 * Updates an existing blog post by its ID.
 * 
 * @param req - Express Request object containing the blog ID in params and update data in the body.
 * @param reqRes - Express Response object used to send the response.
 * @returns A promise that resolves to void.
 */
export const updateBlog = async (req: Request, reqRes: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const blog = await blogService.updateBlog(id, updateData);

    if (!blog) {
      reqRes.status(404).json({ message: 'Blog not found' });
      return; 
    }

    reqRes.json(blog);
  } catch (error) {
    console.error('Error in updateBlog:', error);
    reqRes.status(500).json({ message: 'Server Error', error });
  }
};
