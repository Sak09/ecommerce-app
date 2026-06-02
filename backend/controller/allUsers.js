const userModel = require('../models/userModel');
const redisClient = require('../config/redis');

async function AllUsers(req, res) {
    try {
        const cacheKey = 'users:all';

        // Try to get from cache
        if (redisClient) {
            try {
                const cached = await redisClient.get(cacheKey);
                if (cached) {
                    console.log("✓ All users fetched from cache");
                    return res.json({
                        message: 'All users retrieved from cache',
                        error: false,
                        data: JSON.parse(cached),
                        success: true
                    });
                }
            } catch (cacheError) {
                console.warn("Cache retrieval warning:", cacheError.message);
            }
        }

        const allUsers = await userModel.find();

        // Set cache
        if (redisClient) {
            try {
                await redisClient.setEx(cacheKey, 600, JSON.stringify(allUsers));
                console.log("✓ All users cached for 10 minutes");
            } catch (cacheError) {
                console.warn("Cache storage warning:", cacheError.message);
            }
        }

        res.json({
            message: 'All users retrieved successfully',
            error: false,
            data: allUsers,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: true,
            success: false,
        });
    }
}

module.exports = AllUsers;
