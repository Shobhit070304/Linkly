require("dotenv").config();
const app = require("./src/index");
const http = require("http");
const { connectToRedis } = require("./src/utils/redis-connection");

const PORT = process.env.PORT || 8000;

connectToRedis()
    .then(() => {
        http.createServer(app).listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to Redis. Server not started.", error);
        process.exit(1);
    });