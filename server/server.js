require('dotenv').config();
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Diagnostic validation of required environment configuration
if (!process.env.MONGODB_URI) {
  console.warn(
    '[Config Warning] MONGODB_URI is not set. Defaulting to mongodb://127.0.0.1:27017/taskmanager. ' +
    'For production (e.g. Render / Atlas), please set MONGODB_URI in your environment.'
  );
}

let server;

// Start server after connecting to database
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager');

    server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` MERN CI/CD Task Manager API`);
      console.log(` Server running in [${NODE_ENV}] mode on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` Tasks endpoint: http://localhost:${PORT}/api/tasks`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error(`[Fatal Startup Error] Unable to start server: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`\n[Shutdown] Received ${signal}. Closing HTTP server and database connection...`);
  if (server) {
    server.close(async () => {
      await disconnectDB();
      console.log('[Shutdown] Server successfully terminated.');
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();
