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

// import jwt from 'jsonwebtoken';
// import User from '../Models/User.js'; // ✅ Include .js
// import dotenv from 'dotenv';
// dotenv.config();

// // ✅ Middleware to verify JWT token
// export const verifyToken = async (req, res, next) => {
//     try {
//         const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
//         if (!token) return res.status(401).json({ message: "Access Denied" });

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).populate('role');  // Ensure role is populated
//         if (!req.user) return res.status(404).json({ message: "User not found" });

//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Invalid Token" });
//     }
// };

// // ✅ Middleware to check user's role
// // Middleware to check user's role
// export const verifyRole = (roles) => {
//     return (req, res, next) => {
//         if (!req.user || !roles.includes(req.user.role.name)) { // Check the role name
//             return res.status(403).json({ message: "Access denied: insufficient permissions" });
//         }
//         next();
//     };
// };

// middleware/authMiddleware.js
// import jwt from 'jsonwebtoken';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase.js';
// import dotenv from 'dotenv';

// dotenv.config();

// // Middleware: Verify JWT token and attach user to request
// export const verifyToken = async (req, res, next) => {
//   try {
//     // Get token from cookie or Authorization header
//     const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userRef = doc(db, 'users', decoded.id);
//     const userSnap = await getDoc(userRef);

//     if (!userSnap.exists()) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const userData = userSnap.data();

//     let roleData = null;
//     if (userData.roleId) {
//       const roleRef = doc(db, 'roles', userData.roleId);
//       const roleSnap = await getDoc(roleRef);
//       if (roleSnap.exists()) {
//         roleData = roleSnap.data();
//       }
//     }

//     req.user = {
//       id: decoded.id,
//       email: userData.email,
//       firstname: userData.firstname,
//       lastname: userData.lastname,
//       role: roleData ? { id: userData.roleId, ...roleData } : null,
//     };

//     next();
//   } catch (error) {
//     console.error("Token verification failed:", error.message);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// // Alias if needed
// export const verifyFirebaseToken = verifyToken;

// // Middleware: Check if user has a required role
// export const verifyRole = (allowedRoles = []) => {
//   return (req, res, next) => {
//     const userRole = req.user?.role?.name;
//     if (!userRole || !allowedRoles.includes(userRole)) {
//       return res.status(403).json({ message: "Access denied: insufficient role permissions" });
//     }
//     next();
//   };
// };
