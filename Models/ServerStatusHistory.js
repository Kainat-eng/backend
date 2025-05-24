import mongoose from 'mongoose';

const serverStatusHistorySchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  status: { 
    type: String, 
    enum: ['online', 'offline', 'maintenance'], 
    required: true 
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date }, // If null, it's still ongoing
});

const ServerStatusHistory = mongoose.model('ServerStatusHistory', serverStatusHistorySchema);
export default ServerStatusHistory;

