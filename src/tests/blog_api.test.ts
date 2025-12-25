import request from 'supertest';
import app from '../app';
import blogService from '../services/blog.service';

// Mock the blogService
jest.mock('../services/blog.service');

describe('Blog API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/blogs', () => {
    it('should return a list of blogs with pagination', async () => {
      const mockResult = {
        blogs: [
          { _id: '1', title: 'Test Blog', slug: 'test-blog', content: 'Content', tags: ['tech'] }
        ],
        total: 1
      };
      
      (blogService.getBlogsWithPagination as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app).get('/api/blogs?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(blogService.getBlogsWithPagination).toHaveBeenCalledWith(1, 10, undefined);
    });

    it('should handle errors gracefully', async () => {
      (blogService.getBlogsWithPagination as jest.Mock).mockRejectedValue(new Error('Database Error'));

      const response = await request(app).get('/api/blogs');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Server Error');
    });
  });

  describe('PUT /api/blogs/:id', () => {
    it('should update a blog and return the updated document', async () => {
      const mockBlog = { _id: '1', title: 'Updated Blog', slug: 'updated-blog' };
      const updateData = { title: 'Updated Blog' };

      (blogService.updateBlog as jest.Mock).mockResolvedValue(mockBlog);

      const response = await request(app)
        .put('/api/blogs/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBlog);
      expect(blogService.updateBlog).toHaveBeenCalledWith('1', updateData);
    });

    it('should return 404 if blog is not found', async () => {
      (blogService.updateBlog as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/api/blogs/nonexistent')
        .send({ title: 'New Title' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Blog not found');
    });

    it('should handle errors gracefully', async () => {
      (blogService.updateBlog as jest.Mock).mockRejectedValue(new Error('Update Error'));

      const response = await request(app)
        .put('/api/blogs/1')
        .send({ title: 'New Title' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Server Error');
    });
  });
});
