// // routes/authRoutes.js
// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import Users from '../Models/User.js';
// import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';
// import dotenv from 'dotenv';
// dotenv.config();

// const router = express.Router();

// // User Registration
// router.post('/register', async (req, res) => {
//     try {
//         const { firstname, lastname, email, password, role } = req.body;

//         if (!(firstname && lastname && email && password)) {
//             return res.status(400).send('All fields are required');
//         }

//         const existingUser = await Users.findOne({ email });
//         if (existingUser) {
//             return res.status(401).send('User already exists with this email');
//         }

//         // 🔐 Role check
//         let userRole = 'user';
//         if (role === 'admin') {
//             if (email === process.env.ADMIN_EMAIL) {
//                 userRole = 'admin';
//             } else {
//                 return res.status(403).json({ message: 'You are not allowed to register as admin' });
//             }
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await Users.create({
//             firstname,
//             lastname,
//             email,
//             password: hashedPassword,
//             role: userRole
//         });

//         const token = jwt.sign(
//             { id: user._id, email, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: '2h' }
//         );

//         user.token = token;
//         user.password = undefined;

//         res.status(201).json({ success: true, user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error registering user', error });
//     }
// });

// // User Login
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!(email && password)) {
//             return res.status(400).send('All fields are required');
//         }
//         const user = await Users.findOne({ email });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
//         const options = { expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' };
//         user.password = undefined;
        
//         // Send user and token in response
//         return res.status(200).cookie('token', token, options).json({
//             success: true,
//             token,
//             user: { _id: user._id, email: user.email, role: user.role }
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in' });
//     }
// });

// // Assign Role (Only Admins can assign roles)
// router.put('/assign-role/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
//     try {
//         const { role } = req.body;
//         const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         res.json({ message: 'Role updated successfully', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating role' });
//     }
// });

// // Protected Route (Example: Admin Only)
// router.get('/admin-dashboard', verifyToken, verifyRole(['admin']), (req, res) => {
//     res.json({ message: 'Welcome Admin!' });
// });

// export default router;

import express from 'express';
import {
  registerUser,
  loginUser,
  assignRole,
  getAllUsers,
  updateUser
} from '../controllers/authController.js';
import {
  registerValidation,
  roleAssignmentValidation
} from '../helpers/validators/authValidator.js';
import { validate } from '../middleware/validate.js';
import { verifyFirebaseToken, verifyRole } from '../middleware/verifyFirebaseToken.js';
import checkPermission from '../middleware/checkPermission.js';

const router = express.Router();

router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginUser);

// 🔁 FIXED: Replaced verifyToken with verifyFirebaseToken
router.put(
  '/assign-role/:id',
  verifyFirebaseToken,
  checkPermission('assign:role'),
  roleAssignmentValidation,
  validate,
  assignRole
);

// 🔁 FIXED: Replaced verifyToken with verifyFirebaseToken
router.get('/users', verifyFirebaseToken, verifyRole(['Admin']), getAllUsers);

// 🔁 FIXED: Replaced verifyToken with verifyFirebaseToken
router.put('/users/:id', verifyFirebaseToken, verifyRole(['Admin']), updateUser);

router.get('/admin-data', verifyFirebaseToken, verifyRole(['Admin']), (req, res) => {
  res.send("Protected admin data");
});

export default router;
