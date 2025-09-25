require("dotenv").config();
const app = require("./src/index");
const http = require("http");
const { connectToRedis } = require("./src/utils/redis-connection");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// Simple error handling
process.on('uncaughtException', (error) => {
    console.error('Error:', error);
    process.exit(1);
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