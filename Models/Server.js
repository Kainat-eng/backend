// import mongoose from 'mongoose';

// const serverSchema = new mongoose.Schema({

//     name: { 
//         type: String, 
//         required: true 
//     },
//     ip: {
//      type: String,
//     required: true 
//      },
//     location: { 
//     type: String 
//      },
//     status: { 
//      type: String, 
//      enum: ["online", "offline", "maintenance"], 
//      default: "offline" 
//      },
//      createdBy: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "User"
//      },
//      createdAt: { 
//         type: Date, 
//         default: Date.now 
//     }
// });
// export default mongoose.model("Server", serverSchema);