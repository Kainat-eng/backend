// import express, { json } from 'express';
// const app = express();
// app.use(json());
// app.use(cookieParser())

// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser')

// import cors from 'cors';
// app.use(cors());

// import './db/Connection.js';
// import User from './Models/User.js'; 

// require('dotenv').config()

// app.get("/", (req, res) => {
//     res.send("<h1>Server is working</h1>")
// })

// app.post("/register", async (req, res) => {
//     try{
//         const {firstname, lastname, email, password} = req.body
//         if (!(firstname && lastname && email && password)) {
//             res.status(400).send('All fields are compulsory')
//         }
//         const existingUser = await User.findOne({email})
//         if (existingUser){
//             res.status(401).send('User already exists with this email')
//         }
//         const myEncPassword = await bcrypt.hash(password, 10)
//         const user = await User.create({
//             firstname,
//             lastname,
//             email,
//             password: myEncPassword
//         })
//         const token = jwt.sign(
//             {id: user._id, email},
//             'shhhh',
//             {
//                 expiresIn: "2h"
//             }
//         );
//         user.token = token
//         user.password = undefined

//         res.status(201).json(user)
//     }
//     catch(error) {
//         console.log(error);
//     }
// })

// app.post('/login', async (req, res) =>{
//     try{
//         const {email, password} = req.body
//         if (!(email && password)){
//             res.status(400).send('send all data')
//         }
//         const user= await User.findOne({email})
//         if (!user) {
//             return res.status(404).send('User not found');
//         }
//         if (user && (await bcrypt.compare(password, user.password)))
//             const token = jwt.sign(
//                 {id: user._id}, 
//                 'shhhh',
//             {
//                 expiresIn: "2h"
//             }
//         );
//         user.token = token
//         user.password = undefined

//         const option = {
//             expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//             httpOnly: true
//         };

//         res.status(200).cookie("token", token, options).json({
//             success: true,
//             token,
//             user
//         })
//     }
//     catch (error) {
//         console.log(error);
//     }
// })
// module.exports = app



// Forget Password Route
// app.post("/forget-password", async (req, res) => {
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

// // Delete Account Route
// app.delete("/delete-account", async (req, res) => {
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).send('Email is required');
//         }

//         const user = await User.findOneAndDelete({ email });
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         res.status(200).send('Account deleted successfully');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Something went wrong');
//     }
// });

// import { cpu as _cpu, mem as _mem, currentLoad as _currentLoad, fsSize, osInfo as _osInfo } from 'systeminformation';

// async function testSystemInfo() {
//     try {
//         const cpu = await _cpu();
//         console.log('CPU Information:', cpu);

//         const mem = await _mem();
//         console.log('Memory Information:', mem);

//         const currentLoad = await _currentLoad();
//         console.log('Current Load:', currentLoad);

//         const disk = await fsSize();
//         console.log('Disk Information:', disk);

//         const osInfo = await _osInfo();
//         console.log('OS Information:', osInfo);
//     } catch (error) {
//         console.error('Error testing systeminformation API:', error);
//     }
// }

// testSystemInfo();
