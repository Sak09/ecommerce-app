const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const multer = require("multer");

const signUpController = require("../controller/signUpController"); 
const loginController = require("../controller/loginController");
const userDetailController = require('../controller/userDetailsController');
const auth = require('../middleware/auth');
const uploadController = require('../controller/uploadController').default;
const logoutController = require('../controller/logoutController');
const Allusers = require('../controller/allUsers');
const updateUser = require('../controller/updateUser');
const { addproduct, getAllproduct } = require('../controller/productController');


router.post("/signup", signUpController);
router.post("/login", loginController);  
router.get('/user-details',auth,userDetailController)
router.get('/logout', logoutController);
router.get('/all-users',auth, Allusers)
router.post('/update-user/:id',auth, updateUser)


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); 
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + file.originalname); 
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadController)
router.post("/product", auth, addproduct);
router.get("/all-products",getAllproduct)
module.exports = router;
