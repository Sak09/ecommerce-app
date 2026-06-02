const userModel = require("../models/userModel");
const redisClient = require("../config/redis");

async function userDetailsController(req, res) {
    try {
        const cacheKey = `user:${req.userId}`;

        // Try to get from cache
        if (redisClient) {
            try {
                const cached = await redisClient.get(cacheKey);
                if (cached) {
                    console.log("✓ User details fetched from cache");
                    return res.status(200).json({
                        data: JSON.parse(cached),
                        error: false,
                        success: true,
                        message: "User details (from cache)"
                    });
                }
            } catch (cacheError) {
                console.warn("Cache retrieval warning:", cacheError.message);
            }
        }

        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                data: null,
                error: true,
                success: false,
                message: "User not found"
            });
        }

        // Set cache
        if (redisClient) {
            try {
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(user));
                console.log("✓ User details cached for 1 hour");
            } catch (cacheError) {
                console.warn("Cache storage warning:", cacheError.message);
            }
        }

        res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = userDetailsController;