const express = require("express");
const router = express.Router();

const {
    registerUser,  
    LoginUser,
    getProfile
} = require("../controller/authController");


const { protect } = require("../middleware/authMiddleware"); 

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/profile", protect , getProfile);

module.exports = router;