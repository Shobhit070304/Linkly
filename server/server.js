require("dotenv").config();
const app = require("./src/index");
const http = require("http");
const { connectToRedis } = require("./src/utils/redis-connection");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// Simple error handling
process.on('uncaughtException', (error) => {
    console.error('[UncaughtException] Server will exit:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[UnhandledRejection] at:', promise, 'reason:', reason);
    // Do NOT exit here — log it and let the process continue
    // The specific request/job that failed is already broken, but the server stays up
});


// Connect to Redis and start server
connectToRedis()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to Redis:', error);
        process.exit(1);
    });