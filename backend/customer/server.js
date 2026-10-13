const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { responseHandlerMiddleware } = require('./middleware/responseHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const judgmentRoutes = require('./routes/judgmentRoutes');
const researchRoutes = require('./routes/researchRoutes');
const documentRoutes = require('./routes/documentRoutes');
const contractRoutes = require('./routes/contractRoutes');
const matterRoutes = require('./routes/matterRoutes');
const taskRoutes = require('./routes/taskRoutes');
const eventRoutes = require('./routes/eventRoutes');
const draftRoutes = require('./routes/draftRoutes');
const masterRoutes = require('./routes/masterRoutes');
const leadRoutes = require('./routes/leadRoutes');
const searchRoutes = require('./routes/searchRoutes');

const helmet = require('helmet');
const { generalApiLimiter, sanitizeMongo } = require('./middleware/securityMiddleware');

const requestLogger = require('./middleware/requestLogger');

const app = express();

// 1. Security Headers (Anti-Clickjacking, Anti-MIME sniffing, hide X-Powered-By)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 2. Strict CORS Configuration (Restrict to authorized frontend origins)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS security policy'));
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
  })
);

// 3. Body parsers with safe memory limits (reduced from 50mb to 15mb to prevent DoS)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// 4. NoSQL Query Injection Sanitizer
app.use(sanitizeMongo);

// 5. Global API Rate Limiter
app.use('/api', generalApiLimiter);

// 6. Request logging & standardized response helpers
app.use(requestLogger);
app.use(responseHandlerMiddleware);


// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Legal AI Legal Intelligence Backend',
    timestamp: new Date().toISOString(),
  });
});

// Mount Customer Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer/auth', authRoutes);
app.use('/api/judgments', judgmentRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/matters', matterRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/contact', leadRoutes);
app.use('/api/search', searchRoutes);

// Mount Dedicated Admin Authentication & Enterprise Admin Suite Routes
try {
  const enterpriseAdminAuthRoutes = require('../admin/routes/authRoutes');
  const enterpriseAdminRoutes = require('../admin/routes/adminRoutes');
  const enterpriseCustomerRoutes = require('../admin/routes/customerRoutes');

  // Dedicated Admin Login API (/api/admin/auth/login and /api/admin/login)
  app.use('/api/admin/auth', enterpriseAdminAuthRoutes);
  app.use('/api/admin', enterpriseAdminAuthRoutes);
  app.use('/api/admin', enterpriseAdminRoutes);
  app.use('/api/customer', enterpriseCustomerRoutes);
  console.log('[Unified Backend] Enterprise Admin Suite and Admin Login API mounted successfully');
} catch (err) {
  console.warn('[Unified Backend] Enterprise Admin Suite fallback mounting:', err.message);
  app.use('/api/admin', adminRoutes);
}

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Server
connectDB().then(async () => {
  try {
    const { connectDB: connectAdminDB } = require('../admin/config/db');
    await connectAdminDB(process.env.MONGODB_URI);
    console.log('[Unified DB] Admin storage service synchronized with MongoDB Atlas.');
  } catch (err) {
    console.warn('[Unified DB] Admin DB connection notice:', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`Legal AI Legal Intelligence Backend running on port ${PORT}`);
    console.log(`Auth endpoints:  http://localhost:${PORT}/api/auth`);
    console.log(`Admin endpoints: http://localhost:${PORT}/api/admin`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[Info] Port ${PORT} is already in use by Legal AI backend service. Active instance running.`);
    } else {
      console.error('[Server Error]', err);
    }
  });
});

