/**
 * Performance metrics routes
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Initialize global metrics storage
if (!global.performanceMetrics) {
  global.performanceMetrics = [];
}

/**
 * Get performance metrics
 * Only accessible by authenticated users
 */
router.get("/", auth, (req, res) => {
  try {
    const metrics = global.performanceMetrics || [];

    // Calculate statistics
    const apiMetrics = metrics.filter((m) => m.method);
    const totalRequests = apiMetrics.length;

    const avgDuration =
      totalRequests > 0
        ? apiMetrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests
        : 0;

    const slowRequests = apiMetrics.filter((m) => m.duration > 1000);

    // Group by endpoint
    const endpointStats = {};
    apiMetrics.forEach((m) => {
      const key = `${m.method} ${m.url}`;
      if (!endpointStats[key]) {
        endpointStats[key] = {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
          maxDuration: 0,
        };
      }
      endpointStats[key].count++;
      endpointStats[key].totalDuration += m.duration;
      endpointStats[key].maxDuration = Math.max(
        endpointStats[key].maxDuration,
        m.duration
      );
    });

    // Calculate averages
    Object.keys(endpointStats).forEach((key) => {
      endpointStats[key].avgDuration =
        endpointStats[key].totalDuration / endpointStats[key].count;
    });

    // Memory usage
    const memUsage = process.memoryUsage();

    res.json({
      summary: {
        totalRequests,
        avgDuration: Math.round(avgDuration),
        slowRequests: slowRequests.length,
        uptime: Math.round(process.uptime()),
      },
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
      },
      endpoints: endpointStats,
      recentSlowRequests: slowRequests.slice(-10).map((m) => ({
        method: m.method,
        url: m.url,
        duration: Math.round(m.duration),
        statusCode: m.statusCode,
        timestamp: new Date(m.timestamp).toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error getting metrics:", error);
    res.status(500).json({ error: "Failed to get metrics" });
  }
});

/**
 * Clear metrics
 * Only accessible by authenticated users
 */
router.delete("/", auth, (req, res) => {
  try {
    global.performanceMetrics = [];
    res.json({ message: "Metrics cleared" });
  } catch (error) {
    console.error("Error clearing metrics:", error);
    res.status(500).json({ error: "Failed to clear metrics" });
  }
});

/**
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);

  const health = {
    status: "healthy",
    uptime: Math.round(process.uptime()),
    memory: heapUsedMB,
    timestamp: new Date().toISOString(),
  };

  // Check if memory usage is too high
  if (heapUsedMB > 500) {
    health.status = "warning";
    health.message = "High memory usage detected";
  }

  res.json(health);
});

module.exports = router;
