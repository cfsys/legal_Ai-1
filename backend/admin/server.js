const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.ADMIN_PORT || 5001;

// Disable ETags to ensure 200 OK responses instead of 304 Not Modified
app.set('etag', false);

// Middleware
app.use(cors());
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

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

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

