const mongoose = require('mongoose');

/**
 * Health check controller
 * Returns system health, uptime, environment, and DB status.
 * Never leaks credentials or sensitive environment details.
 */
const getHealth = (req, res) => {
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;
  const dbStatus = dbStatusMap[dbState] || 'unknown';

  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      connected: dbState === 1,
    },
  });
};

module.exports = {
  getHealth,
};
