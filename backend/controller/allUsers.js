const userModel = require('../models/userModel');

async function AllUsers(req, res) {
    try {
        const allUsers = await userModel.find();
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
