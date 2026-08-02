const User = require("../models/User");

const createSuperAdmin = async (req, res) => {
    try {
        const { email, name, password, secretKey } = req.body;

        const superAdminExists = await User.findOne({ role: 'SUPER_ADMIN' });
        if (superAdminExists) {
            return res.status(400).json({
                message: "Super Admin already exists. Only one super admin allowed."
            });
        }

        if (secretKey !== process.env.SUPER_ADMIN_SECRET_KEY) {
            return res.status(403).json({
                message: "Invalid secret key"
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }
        if (!email || !name || !password) {
            return res.status(400).json({
                message: "Please provide email, name, and password"
            });
        }

        const bcrypt = require("bcryptjs");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const superAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'SUPER_ADMIN',
            promotedAt: new Date()
        });

        const jwt = require("jsonwebtoken");
        const token = jwt.sign({ id: superAdmin._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.status(201).json({
            success: true,
            message: "Super Admin created successfully",
            data: {
                _id: superAdmin._id,
                name: superAdmin.name,
                email: superAdmin.email,
                role: superAdmin.role,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({
            $or: [{ role: 'ADMIN' }, { role: 'SUPER_ADMIN' }]
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createSuperAdmin,
    getAllAdmins
};


// Super admin password : SanketSuper@2006
// Admin Password : Sanket@2006
// User Sanket Password : Sanku@123
