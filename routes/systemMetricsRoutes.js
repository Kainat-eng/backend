import express from 'express';
import SystemMetric from '../Models/SystemMetric.js';

const router = express.Router();

// Get recent 5 metrics for frontend chart
router.get('/', async (req, res) => {
  try {
    const metrics = await SystemMetric.find().sort({ createdAt: -1 }).limit(5).lean();
    res.status(200).json(metrics.reverse()); // Return metrics in chronological order
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    res.status(500).json({ message: 'Failed to retrieve metrics' });
  }
});

export default router;
