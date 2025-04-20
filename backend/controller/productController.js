const uploadproductPermission = require('../middleware/permission');
const productModel = require('../models/product')


async function productController(req, res) {
    try {
        const UserId = req.UserId
        if(!uploadproductPermission(UserId)) {
            throw new Error("Permission denied");
        }
        const { productName, brandName, category, description, price } = req.body;

    
        let productImage = [];

        if (req.file) {
        
            productImage.push(req.file.path);
        } else if (req.files) {
    
            req.files.forEach(file => {
                productImage.push(file.path);
            });
        }

        const newProduct = new productModel({
            productName,
            brandName,
            category,
            productImage,
            description,
            price
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product uploaded successfully",
            data: savedProduct
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to upload product",
            error: error.message
        });
    }
}

module.exports = productController;
