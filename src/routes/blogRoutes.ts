import { Router } from 'express';
import { getBlogs, updateBlog, getTags } from '@/controllers/blogController';
import { getBlogsDocs, updateBlogDocs, getTagsDocs } from '@/swagger/blog.swagger';

const router = Router();

// can we import the swagger implementation detail here on top of route for each route 
getBlogsDocs();
router.get('/', getBlogs);

getTagsDocs();
router.get('/tags', getTags);

updateBlogDocs();
router.put('/:id', updateBlog);

export default router;
