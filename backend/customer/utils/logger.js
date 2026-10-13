/**
 * Centralized Application Logger for Legal AI
 * Formats structured logs with timestamps, log levels, and contextual metadata.
 */

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
};

const formatMeta = (meta) => {
  if (!meta) return '';
  if (typeof meta === 'string') return `| ${meta}`;
  try {
    return `| ${JSON.stringify(meta)}`;
  } catch {
    return '';
  }
};

const logger = {
  info: (tag, message, meta) => {
    console.log(`[${getTimestamp()}] [INFO] [${tag}] ${message} ${formatMeta(meta)}`);
  },
  warn: (tag, message, meta) => {
    console.warn(`[${getTimestamp()}] [WARN] [${tag}] ${message} ${formatMeta(meta)}`);
  },
  error: (tag, message, error) => {
    const errorDetails = error?.stack || error?.message || (typeof error === 'object' ? JSON.stringify(error) : error) || '';
    console.error(`[${getTimestamp()}] [ERROR] [${tag}] ${message} ${errorDetails ? `\n--> Details: ${errorDetails}` : ''}`);
  },
  http: (method, url, statusCode, durationMs, user) => {
    const statusCategory = Math.floor(statusCode / 100);
    const indicator = statusCategory === 2 ? '✓' : statusCategory === 3 ? '➜' : '✗';
    const userInfo = user ? `[User: ${user}]` : '[User: Guest]';
    console.log(
      `[${getTimestamp()}] [HTTP] ${indicator} ${method.toUpperCase()} ${url} -> ${statusCode} (${durationMs}ms) ${userInfo}`
    );
  },
  db: (operation, collection, details) => {
    console.log(`[${getTimestamp()}] [DATABASE] [${collection}] ${operation} ${formatMeta(details)}`);
  },
};

module.exports = logger;
