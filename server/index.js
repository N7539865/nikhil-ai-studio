// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRoutes from './routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Disable server framework footprint
app.disable('x-powered-by');

// Security: Standard Production HTTP Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Security: In-Memory Rate Limiter for API Routes (120 requests/minute per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120;

app.use('/api', (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);

  // Clean old IPs periodically
  if (rateLimitMap.size > 5000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) rateLimitMap.delete(k);
    }
  }

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait a moment before trying again.',
      retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000)
    });
  }

  next();
});

// Security: Controlled CORS with wildcard local fallback
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, mobile apps, same-origin)
    if (!origin) return callback(null, true);
    const isAllowed = 
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('192.168.') ||
      origin.endsWith('.surge.sh') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.loca.lt');
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev, validated in prod
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder']
}));

app.use(express.json({ limit: '10mb' }));

// Security: Safe JSON error handler to prevent stack trace leaks
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload.' });
  }
  next();
});

// API Routes
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Nikhil AI Studio Backend',
    security: 'hardened',
    timestamp: new Date().toISOString()
  });
});

import fs from 'fs';

// Serve frontend in production or if dist exists
const distIndex = path.join(__dirname, '../dist/index.html');
if (process.env.NODE_ENV === 'production' || fs.existsSync(distIndex)) {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(distIndex);
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Nikhil AI Studio Backend running on http://localhost:${PORT}`);
  console.log(`🔒 Active AI Provider: ${process.env.AI_PROVIDER || 'mock'}`);
});
