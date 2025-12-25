import dotenv from 'dotenv';
import connectDB from '@/config/db';
import app from './app';

dotenv.config();

const envPort = process.env.PORT;
const PORT = (envPort && envPort !== '5000') ? envPort : 5001;

// Database Connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
