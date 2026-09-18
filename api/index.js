// api/index.js - Vercel Serverless Function entry point
import express from 'express';
import cors from 'cors';
import aiRoutes from '../server/routes/ai.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mount AI routes
app.use('/api/ai', aiRoutes);
app.use('/api', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Nikhil AI Studio Serverless Backend',
    timestamp: new Date().toISOString()
  });
});

export default app;
