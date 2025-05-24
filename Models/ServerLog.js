import mongoose from 'mongoose';

const serverLogSchema = new mongoose.Schema({
    serverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Server", 
        required: true 
     },
    cpuUsage: Number,
    memoryUsage: Number,
    diskSpace: Number,
    timestamp: { 
     type: Date, 
     default: Date.now 
     }
  });

export default mongoose.model("ServerLog", serverLogSchema);