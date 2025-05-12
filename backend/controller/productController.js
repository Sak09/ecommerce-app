const uploadproductPermission = require("../middleware/permission");
const productModel = require("../models/product");

async function addproduct(req, res) {
  try {
    const UserId = req.UserId;
    if (!uploadproductPermission(UserId)) {
      throw new Error("Permission denied");
    }
    const { name, brandName, category, description, price } = req.body;

    let productImage = [];

    if (req.file) {
      productImage.push(req.file.path);
    } else if (req.files) {
      req.files.forEach((file) => {
        productImage.push(file.path);
      });
    }

    const newProduct = new productModel({
      name,
      brandName,
      category,
      productImage,
      description,
      price,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product uploaded successfully",
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload product",
      error: error.message,
    });
  }
}

async function getAllproduct(req, res) {
  try {
    const product = await productModel.find();
    res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch products",
      error: error.message,
    });
  }
}

module.exports = {addproduct, getAllproduct};
