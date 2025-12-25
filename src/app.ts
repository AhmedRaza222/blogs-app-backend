import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from '@/routes/blogRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '@/swagger/swagger';
import rateLimit from 'express-rate-limit';
import '@/models/User'; // Register User model

dotenv.config();

const app = express();

// Rate Limiter configuration
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter); // Apply rate limiter to all requests

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/blogs', blogRoutes);

app.get('/', (req, res) => {
  res.send('Blog API is running...');
});

export default app;
