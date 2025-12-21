const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id; // from auth middleware

    // Check if already in cart
    const existingItem = await Cart.findOne({ userId, productId });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Product already in cart",
      });
    }

    const cartItem = await Cart.create({
      userId,
      productId,
    });

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.find({ userId })
      .populate("productId");

    res.status(200).json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const deletedItem = await Cart.findOneAndDelete({
      userId,
      productId,
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


