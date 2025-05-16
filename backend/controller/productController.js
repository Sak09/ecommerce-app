const uploadproductPermission = require("../middleware/permission");
const productModel = require("../models/product");

async function addproduct(req, res) {
  try {
    const UserId = req.UserId;
    if (!uploadproductPermission(UserId)) {
      throw new Error("Permission denied");
    }
    const { name, brandName, category, description, price, image } = req.body;
    //  let productImage = [];
    // if (image) {
    //   productImage.push(image.path);
    // } else if (req.files) {
    //   req.files.forEach((file) => {
    //     productImage.push(file.path);
    //   });
    // }

     const productImage = Array.isArray(image) ? image : [image];
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
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, {
      new: true, 
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};


module.exports = {addproduct, getAllproduct, deleteProduct, updateProduct};
