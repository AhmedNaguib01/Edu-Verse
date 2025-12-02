/**
 * Optimization middleware for better performance
 */

const rateLimit = require("express-rate-limit");

/**
 * Rate limiting middleware
 */
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

/**
 * Different rate limits for different endpoints
 */
const rateLimits = {
  // Strict rate limit for auth endpoints
  auth: createRateLimit(15 * 60 * 1000, 5), // 5 requests per 15 minutes

  // Moderate rate limit for API endpoints
  api: createRateLimit(15 * 60 * 1000, 100), // 100 requests per 15 minutes

  // Lenient rate limit for file uploads
  upload: createRateLimit(15 * 60 * 1000, 20), // 20 uploads per 15 minutes

  // Very strict for search to prevent abuse
  search: createRateLimit(1 * 60 * 1000, 10), // 10 searches per minute
};

/**
 * Pagination middleware
 */
const pagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100 items
  const skip = (page - 1) * limit;

  req.pagination = {
    page,
    limit,
    skip,
  };

  next();
};

/**
 * Response optimization middleware
 */
const optimizeResponse = (req, res, next) => {
  // Add cache headers for static content
  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year
  }

  // Add security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
};

/**
 * Request logging middleware for performance monitoring
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.url} - ${duration}ms`);
    }

    // Log to performance metrics if available
    if (global.performanceMetrics) {
      global.performanceMetrics.push({
        method: req.method,
        url: req.url,
        duration,
        timestamp: Date.now(),
        statusCode: res.statusCode,
      });
    }
  });

  next();
};

/**
 * Memory usage monitoring
 */
const memoryMonitor = (req, res, next) => {
  const memUsage = process.memoryUsage();

  // Log high memory usage
  if (memUsage.heapUsed > 100 * 1024 * 1024) {
    // 100MB
    console.warn(
      `High memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`
    );
  }

  next();
};

/**
 * Database query optimization middleware
 */
const queryOptimization = (req, res, next) => {
  // Add lean option for read-only queries
  if (req.method === "GET") {
    req.queryOptions = { lean: true };
  }

  next();
};

module.exports = {
  rateLimits,
  pagination,
  optimizeResponse,
  requestLogger,
  memoryMonitor,
  queryOptimization,
};
