// seedRoles.js
import mongoose from "mongoose";
import dotenv from 'dotenv';
import Role from "./Models/Role.js"; // adjust the path if needed

dotenv.config();

const roles = [
  { name: "Admin", permissions: [] },
  { name: "ServerAdmin", permissions: [] },
  { name: "user", permissions: [] } // Important: this is needed for default registration
];

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }] // e.g. ['CREATE_SERVER', 'VIEW_USERS']
});


mongoose
  .connect(process.env.DB_URI, {
    // The options below are now deprecated, so you can remove them if you like
  })
  .then(async () => {
    console.log("MongoDB connected");

    await Role.deleteMany({});
    await Role.insertMany(roles);

    console.log("Roles seeded successfully!");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    mongoose.disconnect();
  });
