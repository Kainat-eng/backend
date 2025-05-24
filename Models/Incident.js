import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: ['downtime', 'performance', 'security', 'other'], 
    required: true 
  },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'investigating', 'resolved'], 
    default: 'open' 
  },
  timestamp: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
});

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;

