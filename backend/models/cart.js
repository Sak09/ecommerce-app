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
