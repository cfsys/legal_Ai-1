const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { connectDB, getIsMongooseConnected } = require('./config/db');

const app = express();
const PORT = process.env.ADMIN_PORT || 5001;

// Disable ETags to ensure 200 OK responses instead of 304 Not Modified
app.set('etag', false);

// CORS configuration (supports local dev and Vercel domains)
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'https://legalai-phi.vercel.app',
];

const envOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const allowedOrigins = [...defaultAllowedOrigins, ...envOrigins];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Cache-Control',
    'Pragma',
    'Expires',
    'Accept',
  ],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Anti-caching headers middleware for real-time admin API
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

// Request logger for admin traceability
app.use((req, res, next) => {
  console.log(`[Admin API] ${req.method} ${req.originalUrl}`);
  next();
});

// Ensure MongoDB Atlas is connected before servicing requests (Crucial for Vercel Serverless)
app.use(async (req, res, next) => {
  if (!getIsMongooseConnected()) {
    try {
      await connectDB();
    } catch (err) {
      console.warn('[Admin DB Middleware Notice] Database connection attempt:', err.message);
    }
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Legal AI Enterprise Admin Suite API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');

// 1. High priority: Mount Auth routes under both /api/admin/auth and /api/auth
app.use('/api/admin/auth', authRoutes);
app.use('/admin/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// 2. Admin Suite Management routes
app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);
app.use('/api', adminRoutes);

// 3. Customer analytics routes for admin
app.use('/api/customer', customerRoutes);
app.use('/customer', customerRoutes);

const { sendError } = require('./utils/responseHandler');
const { ERROR } = require('./constants/appStrings');

// Error handler
app.use((err, req, res, next) => {
  console.error('[Admin Server Error]', err);
  return sendError(res, err.message || ERROR.INTERNAL_SERVER_ERROR, err.status || 500, err);
});

// Start Server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`Legal AI Admin Suite Backend running on port ${PORT}`);
    console.log(`Health Check:    http://localhost:${PORT}/api/health`);
    console.log(`Admin Overview:  http://localhost:${PORT}/api/admin/overview`);
    console.log(`Admin Users:     http://localhost:${PORT}/api/admin/users`);
    console.log(`Law Firms:       http://localhost:${PORT}/api/admin/firms`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[Notice] Port ${PORT} already active.`);
    } else {
      console.error('[Server Error]', err);
    }
  });
});

module.exports = app;

