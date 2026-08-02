const adminProtect = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized - No user found"
            });
        }

        if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                message: "Access denied - Admin privileges required"
            });
        }

        if (req.user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked by administrator"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const superAdminProtect = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized - No user found"
            });
        }

        if (req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                message: "Access denied - Super Admin privileges required"
            });
        }

        if (req.user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked by administrator"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { adminProtect, superAdminProtect };
