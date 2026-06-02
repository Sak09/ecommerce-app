const userModel = require("../models/userModel");
const crypto = require("crypto");

// For this example, we'll store reset tokens in memory (in production, use email/SMS service)
const resetTokens = new Map();

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({
        message: "If an account exists for this email, you will receive a password reset link",
        error: false,
        success: true,
      });
    }

    // Generate reset token (6-digit code)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Store reset token in memory (in production, save to database and send via email)
    resetTokens.set(email, {
      token: resetToken,
      expiry: resetTokenExpiry,
      userId: user._id,
    });

    // In production, send email here with reset link
    console.log(`Reset code for ${email}: ${resetToken}`);

    return res.status(200).json({
      message: "Password reset code sent to your email",
      error: false,
      success: true,
      email: email, // Return for demo purposes
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email, resetToken, newPassword, confirmPassword } = req.body;

    if (!email || !resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        error: true,
        success: false,
      });
    }

    // Verify reset token
    const storedToken = resetTokens.get(email);

    if (!storedToken) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
        error: true,
        success: false,
      });
    }

    if (storedToken.token !== resetToken) {
      return res.status(400).json({
        message: "Invalid reset code",
        error: true,
        success: false,
      });
    }

    if (Date.now() > storedToken.expiry) {
      resetTokens.delete(email);
      return res.status(400).json({
        message: "Reset code has expired. Please request a new one",
        error: true,
        success: false,
      });
    }

    // Update password
    const hashedPassword = await require("bcrypt").hash(newPassword, 10);
    
    await userModel.findByIdAndUpdate(storedToken.userId, {
      password: hashedPassword,
    });

    // Clear reset token
    resetTokens.delete(email);

    return res.status(200).json({
      message: "Password reset successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

module.exports = { forgotPasswordController, resetPasswordController };
