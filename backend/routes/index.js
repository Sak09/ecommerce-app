const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const multer = require("multer");

const signUpController = require("../controller/signUpController"); // Ensure this is a function
const loginController = require("../controller/loginController");   // Ensure this is a function
const userDetailController = require('../controller/userDetailsController');
const auth = require('../middleware/auth');
const uploadController =require('../controller/uploadController');
const logoutController = require('../controller/logoutController');
const Allusers = require('../controller/allUsers');
const updateUser = require('../controller/updateUser');


router.post("/signup", signUpController);
router.post("/login", loginController);   // Attach the handler
router.get('/user-details',auth,userDetailController)
router.get('/logout', logoutController);
router.get('/all-users',auth, Allusers)
router.post('/update-user/:id',auth, updateUser)


// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadController)
module.exports = router;
