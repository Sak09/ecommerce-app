const { createClient } = require("redis");

let redisClient = null;

async function initializeRedis() {
  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("connect", () => {
      console.log("✓ Redis Connected");
    });

    redisClient.on("error", (err) => {
      console.error("✗ Redis Error:", err);
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
    redisClient = null;
  }
}

// Initialize Redis on module load
initializeRedis();

module.exports = redisClient;
