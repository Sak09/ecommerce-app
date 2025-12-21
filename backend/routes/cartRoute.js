const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  deleteFromCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middlewares/auth");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/remove/:productId", authMiddleware, deleteFromCart);

module.exports = router;
