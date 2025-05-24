// middleware/authMiddleware.js
// import jwt from 'jsonwebtoken';
// import Users from '../Models/User';
// import dotenv from 'dotenv';
// dotenv.config();

// export const verifyToken = async (req, res, next) => {
//     try {
//         const token = req.cookies.token || (req.header("Authorization")?.split(" ")[1]);
//         if (!token) return res.status(401).json({ message: "Access Denied" });
        
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await Users.findById(decoded.id);
//         if (!req.user) return res.status(404).json({ message: "User not found" });
        
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Invalid Token" });
//     }
// };

import jwt from 'jsonwebtoken';
import User from '../Models/User.js'; // ✅ Include .js
import dotenv from 'dotenv';
dotenv.config();

// ✅ Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access Denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).populate('role');  // Ensure role is populated
        if (!req.user) return res.status(404).json({ message: "User not found" });

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

// ✅ Middleware to check user's role
// Middleware to check user's role
export const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role.name)) { // Check the role name
            return res.status(403).json({ message: "Access denied: insufficient permissions" });
        }
        next();
    };
};

