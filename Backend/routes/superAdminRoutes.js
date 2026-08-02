const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { superAdminProtect } = require("../middleware/adminMiddleware");
const { createSuperAdmin, getAllAdmins } = require("../controller/superAdminController");

router.post("/create-super-admin", createSuperAdmin);

router.get("/admins", protect, superAdminProtect, getAllAdmins);

module.exports = router;
