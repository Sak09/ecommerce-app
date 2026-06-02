const userModel = require("../models/userModel");
const redisClient = require("../config/redis");

async function updateUser(req, res) {
    try {
        const { id } = req.params; 
        const sessionUser = req.userId; 
        const { email, name, role } = req.body;

        // Ensure userId exists
        if (!id) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        // Check if the requester is a valid user (optional, but recommended)
        const user = await userModel.findById(sessionUser);
        if (!user) {
            return res.status(403).json({
                message: "Unauthorized: User not found",
                error: true,
                success: false,
            });
        }

        const payload = {};
        if (email) payload.email = email;
        if (name) payload.name = name;
        if (role) payload.role = role;

        const updatedUser = await userModel.findByIdAndUpdate(id, payload, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        // Invalidate user cache
        if (redisClient) {
            try {
                await redisClient.del(`user:${id}`);
                await redisClient.del("users:all");
                console.log("✓ Cache cleared: user data");
            } catch (cacheError) {
                console.warn("Cache invalidation warning:", cacheError.message);
            }
        }

        res.json({
            data: updatedUser,
            message: "User updated successfully",
            success: true,
            error: false,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

module.exports = updateUser;
