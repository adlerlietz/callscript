import express from 'express';

/**
 * CallScript.io API Server
 * 
 * Main entry point for the CallScript.io backend API.
 * Provides health check endpoint and server initialization.
 */
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

/**
 * Health check endpoint
 * @returns {object} Server status and timestamp
 */
app.get('/health', (_req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'callscript-api',
  });
});

/**
 * Start the server
 */
function startServer(): void {
  console.log(`CallScript.io API server starting on port ${PORT}`);
  app.listen(PORT, () => {
    console.log(`🚀 CallScript.io API server running on port ${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  });
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export default app;