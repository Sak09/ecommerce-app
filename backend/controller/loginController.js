const bcrypt = require("bcrypt");
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        if (!email) {
            throw new Error("Please provide the email");
        }
        if (!password) {
            throw new Error("Please provide the password");
        }

       
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            throw new Error("Incorrect password. Please try again.");
        }

       
        const tokendata = {
            _id: user._id,
            email: user.email,
        };
        const token = jwt.sign(tokendata, process.env.SECRET_KEY, { expiresIn: 60 * 60 });

       
        const tokenOptions = {
            httpOnly: true,
            secure: false,
            sameSite: "lax", 
        };

      
        res.cookie("token", token, tokenOptions);

      
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
        
        res.status(500).json({
            message: error.message,
            error: true,
            success: false,
        });
    }
};

module.exports = loginController;
