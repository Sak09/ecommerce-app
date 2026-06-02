const redisClient = require("../config/redis");
const uploadproductPermission = require("../middleware/permission");
const productModel = require("../models/product");

async function addproduct(req, res) {
  try {
    const UserId = req.UserId;
    if (!uploadproductPermission(UserId)) {
      throw new Error("Permission denied");
    }
    const { name, brandName, category, description, price, image } = req.body;

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

    // Invalidate cache
    if (redisClient) {
      try {
        await redisClient.del("products:all");
        console.log("✓ Cache cleared: products:all");
      } catch (cacheError) {
        console.warn("Cache invalidation warning:", cacheError.message);
      }
    }

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
    const cachekey = "products:all";
    
    // Try to get from cache
    if (redisClient) {
      try {
        const cached = await redisClient.get(cachekey);
        if (cached) {
          console.log("✓ Products fetched from cache");
          return res.status(200).json({
            success: true,
            message: "Products fetched from cache",
            data: JSON.parse(cached),
          });
        }
      } catch (cacheError) {
        console.warn("Cache retrieval warning:", cacheError.message);
      }
    }

    const product = await productModel.find().sort({ createdAt: -1 });
    
    // Set cache
    if (redisClient) {
      try {
        await redisClient.setEx(cachekey, 300, JSON.stringify(product));
        console.log("✓ Products cached for 5 minutes");
      } catch (cacheError) {
        console.warn("Cache storage warning:", cacheError.message);
      }
    }

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

    // Invalidate cache
    if (redisClient) {
      try {
        await redisClient.del("products:all");
        console.log("✓ Cache cleared: products:all");
      } catch (cacheError) {
        console.warn("Cache invalidation warning:", cacheError.message);
      }
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
};

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

    // Invalidate cache
    if (redisClient) {
      try {
        await redisClient.del("products:all");
        console.log("✓ Cache cleared: products:all");
      } catch (cacheError) {
        console.warn("Cache invalidation warning:", cacheError.message);
      }
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

const getCategoryProduct = async (req, res) => {
  try {
    const cacheKey = "products:categories";

    // Try to get from cache
    if (redisClient) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          console.log("✓ Categories fetched from cache");
          return res.json({
            message: "Products by category",
            data: JSON.parse(cached),
            success: true,
            error: false,
          });
        }
      } catch (cacheError) {
        console.warn("Cache retrieval warning:", cacheError.message);
      }
    }

    const productCategories = await productModel.distinct("category");
    const productByCategory = [];

    for (const category of productCategories) {
      const product = await productModel.findOne({ category });
      if (product) {
        productByCategory.push(product);
      }
    }

    // Set cache
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, 600, JSON.stringify(productByCategory));
        console.log("✓ Categories cached for 10 minutes");
      } catch (cacheError) {
        console.warn("Cache storage warning:", cacheError.message);
      }
    }

    res.json({
      message: "Products by category",
      data: productByCategory, 
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
};

module.exports = { addproduct, getAllproduct, deleteProduct, updateProduct, getCategoryProduct };
