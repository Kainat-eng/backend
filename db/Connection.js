import mongoose from "mongoose";

const uri = "mongodb://kainat:123456@localhost:27017/ServerEye"; // Replace with your connection string
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));
