// import express, { json } from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import dotenv from 'dotenv';
// import './db/Connection.js';
// import User from './Models/User.js';
// import systeminformation from 'systeminformation';

// dotenv.config();

// const app = express();

// // CORS Configuration
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
// }));

// // Middlewares
// app.use(json());
// app.use(cookieParser());

// // Preflight OPTIONS Handler
// app.options('*', cors());

// // Registration Route
// app.post('/register', async (req, res) => {
//     try {
//         const { firstname, lastname, email, password, role } = req.body;

//         if (!(firstname && lastname && email && password)) {
//             return res.status(400).send('All fields are required');
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(401).send('User already exists with this email');
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = await User.create({
//             firstname,
//             lastname,
//             email,
//             password: hashedPassword,
//             role: role || 'user',
//         });

//         const token = jwt.sign(
//             { id: user._id, email, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: '2h' }
//         );

//         user.token = token;
//         user.password = undefined;

//         res.status(201).json(user);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Something went wrong');
//     }
// });

// // Login Route
// app.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!(email && password)) {
//             return res.status(400).send('All fields are required');
//         }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         if (await bcrypt.compare(password, user.password)) {
//             const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

//             const options = {
//                 expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
//                 sameSite: 'Lax',
//             };

//             user.password = undefined;

//             return res.status(200).cookie('token', token, options).json({
//                 success: true,
//                 token,
//                 user,
//             });
//         }

//         res.status(400).send('Invalid Credentials');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Something went wrong');
//     }
// });

// // Forget Password Route
// app.post('/forget-password', async (req, res) => {
//     try {
//         const { email, newPassword } = req.body;

//         if (!(email && newPassword)) {
//             return res.status(400).send('Email and new password are required');
//         }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;
//         await user.save();

//         res.status(200).send('Password updated successfully');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Something went wrong');
//     }
// });

// // Fetch all users
// app.get('/users', async (_req, res) => {
//     try {
//         const users = await User.find().select('-password');
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching users', error });
//     }
// });

// // Update a user
// app.put('/users/:id', async (req, res) => {
//     const { id } = req.params;
//     const { firstname, lastname, email, password } = req.body;

//     try {
//         const updateData = { firstname, lastname, email };
//         if (password) {
//             updateData.password = await bcrypt.hash(password, 10);
//         }

//         const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.json({ message: 'User updated successfully', user: updatedUser });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating user', error });
//     }
// });


// app.get('/system-metrics', async (req, res) => {
//     try {
//         // Retrieve system metrics
//         const cpu = await systeminformation.cpu();
//         const currentLoad = await systeminformation.currentLoad();
//         const mem = await systeminformation.mem();
//         const disk = await systeminformation.fsSize();
//         const temperature = await systeminformation.cpuTemperature(); // CPU temperature
//         const network = await systeminformation.networkStats(); // Network stats (in/out traffic)
//         const uptime = await systeminformation.time(); // System uptime

//         // Respond with the gathered data
//         res.json({
//             cpu,
//             currentLoad,
//             mem,
//             disk,
//             temperature, // CPU temperature data
//             network, // Network traffic data
//             uptime, // System uptime
//         });
//     } catch (error) {
//         handleError(res, error);
//     }
// });


// // Start Server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/Connection.js';  // Import connection
import authRoutes from './routes/authRoutes.js';
import serverRoutes from './routes/serverRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';
import cron from 'node-cron';
import './cron/index.js'; // This will start the cron job
import collectMetrics from './cron/collectMetrics.js';
import systemMetricsRoutes from './routes/systemMetricsRoutes.js';
import { trackUptime } from './cron/uptimeTracker.js';
import systemRoutes from './routes/systemRoutes.js';  // Add the '.js' extension

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware
app.use(json());
app.use(cookieParser());
app.options('*', cors());

// Routes
app.use('/api/system-metrics', systemMetricsRoutes);


// Collect metrics every 1 minute
cron.schedule('* * * * *', collectMetrics);
setInterval(trackUptime, 60 * 1000);
app.use('/api', systemRoutes);
app.use('/api/auth', authRoutes);              // login, register, forgot-password
app.use('/api/server', serverRoutes);          // ServerAdmin operations (e.g., server CRUD)
app.use('/api/permissions', permissionRoutes); // permission CRUD for Admin

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
