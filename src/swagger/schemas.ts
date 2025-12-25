/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - slug
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the blog
 *         title:
 *           type: string
 *           description: The title of the blog
 *         sub_title:
 *           type: string
 *           description: The sub-title of the blog
 *         content:
 *           type: string
 *           description: The content of the blog
 *         slug:
 *           type: string
 *           description: The slug of the blog
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: The tags of the blog
 *         author:
 *           type: string
 *           description: The user ID of the author
 *         created_date:
 *           type: string
 *           format: date-time
 *           description: The date the blog was created
 *         modified_date:
 *           type: string
 *           format: date-time
 *           description: The date the blog was last modified
 *       example:
 *         title: My First Blog
 *         sub_title: An intro to blogs
 *         content: This is the content of the blog.
 *         slug: my-first-blog
 *         tags: [tech, coding]
 *         author: 60d0fe4f5311236168a109ca
 */
