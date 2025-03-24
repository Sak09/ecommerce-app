const bcrypt = require("bcrypt");
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email) {
            throw new Error("Please provide the email");
        }
        if (!password) {
            throw new Error("Please provide the password");
        }

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        // Compare the provided password with the stored hashed password
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            throw new Error("Incorrect password. Please try again.");
        }

        // Create JWT token
        const tokendata = {
            _id: user._id,
            email: user.email,
        };
        const token = jwt.sign(tokendata, process.env.SECRET_KEY, { expiresIn: 60 * 60 });

        // Set cookie options
        const tokenOptions = {
            httpOnly: true,
            secure: false,
            sameSite: "lax", // Set as required (e.g., 'none' for cross-origin)
        };

        // Set token in cookie
        res.cookie("token", token, tokenOptions);

        // Send response
        res.status(200).json({
            message: "Login successful",
            data: {
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                },
            },
            error: false,
            success: true,
        });
    } catch (error) {
        // Send error response
        res.status(500).json({
            message: error.message,
            error: true,
            success: false,
        });
    }
};

module.exports = loginController;
