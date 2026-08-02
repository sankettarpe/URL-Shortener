const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminProtect, superAdminProtect } = require("../middleware/adminMiddleware");

const {
    getAllUsers,
    getAllUrls,
    blockUnblockUser,
    deleteLink,
    getPlatformStats,
    searchUsers,
    getUserDetails,
    promoteToAdmin,
    demoteFromAdmin,
    getAuditLogs
} = require("../controller/adminController");

router.use(protect, adminProtect);

router.get("/users", getAllUsers);
router.get("/users/search", searchUsers);
router.get("/users/:userId", getUserDetails);
router.put("/users/:userId/block", blockUnblockUser);

router.get("/urls", getAllUrls);
router.delete("/urls/:linkId", deleteLink);

router.get("/stats", getPlatformStats);

router.put("/users/:userId/promote", superAdminProtect, promoteToAdmin);
router.put("/users/:userId/demote", superAdminProtect, demoteFromAdmin);
router.get("/audit-logs", superAdminProtect, getAuditLogs);

module.exports = router;
