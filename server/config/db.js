const mongoose = require('mongoose');
const dns = require('dns');

// On Windows, local ISP/router DNS servers often fail on MongoDB SRV queries (querySrv ECONNREFUSED).
// Configure Google and Cloudflare public DNS resolvers as fallback for reliable Atlas connection.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Gracefully continue if environment restricts DNS setting
}

/**
 * Connect to MongoDB instance with robust error handling and diagnostics.
 * @param {string} [uri] - Optional MongoDB URI (defaults to process.env.MONGODB_URI)
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async (uri = process.env.MONGODB_URI) => {
  if (!uri) {
    const errorMsg = 'CRITICAL CONFIGURATION ERROR: MONGODB_URI is not defined in environment variables. Please check your .env file.';
    console.error(`[Database Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const mongooseOptions = {
      serverSelectionTimeoutMS: 5000,
      ...(process.env.MONGODB_CERT_PATH && {
        tlsCertificateKeyFile: process.env.MONGODB_CERT_PATH,
      }),
    };

    const conn = await mongoose.connect(uri, mongooseOptions);

    if (process.env.NODE_ENV !== 'test') {
      console.log(`[Database] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    }

    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    // Rethrow to allow server or test runner to handle appropriately
    throw error;
  }
};

/**
 * Disconnect from MongoDB (useful for teardown during testing or graceful shutdown)
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (process.env.NODE_ENV !== 'test') {
      console.log('[Database] MongoDB connection closed');
    }
  } catch (error) {
    console.error(`[Database Error] Error closing MongoDB connection: ${error.message}`);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
