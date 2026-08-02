const User = require("../models/User");
const Url = require("../models/url");

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit); 

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                totalUsers,
                totalPages
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllUrls = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        let filter = { isDeleted: false };

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const urls = await Url.find(filter)
            .populate('user', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUrls = await Url.countDocuments(filter);
        const totalPages = Math.ceil(totalUrls / limit);

        res.status(200).json({
            success: true,
            data: urls,
            pagination: {
                page,
                limit,
                totalUrls,
                totalPages
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const blockUnblockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isBlocked } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isBlocked = isBlocked;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteLink = async (req, res) => {
    try {
        const { linkId } = req.params;
        const { reason, isMalicious } = req.body;

        const link = await Url.findById(linkId);
        if (!link) {
            return res.status(404).json({
                message: "Link not found"
            });
        }

        link.isDeleted = true;
        link.isMalicious = isMalicious || false;
        link.deletionReason = reason || "Deleted by admin";
        await link.save();

        res.status(200).json({
            success: true,
            message: "Link deleted successfully",
            data: link
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const blockedUsers = await User.countDocuments({ isBlocked: true });
        const activeUsers = totalUsers - blockedUsers;

        const totalUrls = await Url.countDocuments({ isDeleted: false });
        const maliciousUrls = await Url.countDocuments({ isMalicious: true, isDeleted: true });
        const deletedUrls = await Url.countDocuments({ isDeleted: true });

        const urlStats = await Url.aggregate([
            {
                $match: { isDeleted: false }
            },
            {
                $group: {
                    _id: null,
                    totalClicks: { $sum: "$clicks" },
                    avgClicks: { $avg: "$clicks" }
                }
            }
        ]);

        const totalClicks = urlStats.length > 0 ? urlStats[0].totalClicks : 0;
        const avgClicks = urlStats.length > 0 ? urlStats[0].avgClicks : 0;

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const dailyUrls = await Url.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const topUsers = await Url.aggregate([
            {
                $match: { isDeleted: false }
            },
            {
                $group: {
                    _id: "$user",
                    urlCount: { $sum: 1 },
                    totalClicks: { $sum: "$clicks" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $sort: { urlCount: -1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    userName: "$userInfo.name",
                    userEmail: "$userInfo.email",
                    urlCount: 1,
                    totalClicks: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    blocked: blockedUsers
                },
                urls: {
                    total: totalUrls,
                    deleted: deletedUrls,
                    malicious: maliciousUrls
                },
                clicks: {
                    total: totalClicks,
                    average: Math.round(avgClicks)
                },
                dailyUrls,
                topUsers
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        })
            .select("-password")
            .limit(10);

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const urls = await Url.find({ user: userId, isDeleted: false });
        const deletedUrls = await Url.find({ user: userId, isDeleted: true });

        res.status(200).json({
            success: true,
            data: {
                user,
                activeUrls: urls.length,
                deletedUrls: deletedUrls.length,
                totalClicks: urls.reduce((sum, url) => sum + url.clicks, 0),
                urls
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const AdminAudit = require("../models/AdminAudit");

        if (req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                message: "Only Super Admin can promote users"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            return res.status(400).json({
                message: "User is already an admin"
            });
        }

        user.role = 'ADMIN';
        user.promotedAt = new Date();
        user.promotedBy = req.user._id;
        await user.save();

        await AdminAudit.create({
            admin: req.user._id,
            action: 'PROMOTE_ADMIN',
            targetUser: userId,
            details: `${user.name} promoted to ADMIN role`,
            status: 'SUCCESS'
        });

        res.status(200).json({
            success: true,
            message: `${user.name} has been promoted to Admin`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const demoteFromAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const AdminAudit = require("../models/AdminAudit");

        if (req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                message: "Only Super Admin can demote admins"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === 'USER') {
            return res.status(400).json({
                message: "User is already a regular user"
            });
        }

        if (user.role === 'SUPER_ADMIN') {
            return res.status(403).json({
                message: "Super Admin cannot be demoted"
            });
        }

        user.role = 'USER';
        await user.save();

        
        await AdminAudit.create({
            admin: req.user._id,
            action: 'DEMOTE_ADMIN',
            targetUser: userId,
            details: `${user.name} demoted from ADMIN role`,
            status: 'SUCCESS'
        });

        res.status(200).json({
            success: true,
            message: `${user.name} has been demoted to User`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAuditLogs = async (req, res) => {
    try {
        const AdminAudit = require("../models/AdminAudit");
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        if (req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                message: "Only Super Admin can view audit logs"
            });
        }

        const logs = await AdminAudit.find()
            .populate('admin', 'name email')
            .populate('targetUser', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalLogs = await AdminAudit.countDocuments();
        const totalPages = Math.ceil(totalLogs / limit);

        res.status(200).json({
            success: true,
            data: logs,
            pagination: {
                page,
                limit,
                totalLogs,
                totalPages
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
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
};
