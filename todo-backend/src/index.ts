import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRouters from './routes/tasks';
import { dbConnection } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbConnection.getConnectionState(),
    uptime: process.uptime()
  });
});

// Mount router
app.use('/api/tasks', taskRouters);

// Start server function
async function startServer() {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await dbConnection.connect(mongoUri);

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server started on http://localhost:${PORT}`);
      console.log(`📋 API endpoints available at http://localhost:${PORT}/api/tasks`);
      console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start server using MongoDB Atlas connection
startServer();
