require("dotenv").config();
const app = require("./src/index");
const http = require("http");
const { connectToRedis } = require("./src/utils/redis-connection");

const PORT = process.env.PORT || 8000;

connectToRedis()
    .then(() => {
        http.createServer(app).listen(PORT, () => {
        });
    })
    .catch((error) => {
        process.exit(1);
    });