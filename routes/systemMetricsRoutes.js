// import express from 'express';
// import SystemMetric from '../Models/SystemMetric.js';

// const router = express.Router();

// // Get recent 5 metrics for frontend chart
// router.get('/', async (req, res) => {
//   try {
//     const metrics = await SystemMetric.find().sort({ createdAt: -1 }).limit(5).lean();
//     res.status(200).json(metrics.reverse()); // Return metrics in chronological order
//   } catch (error) {
//     console.error('Error fetching system metrics:', error);
//     res.status(500).json({ message: 'Failed to retrieve metrics' });
//   }
// });

// export default router;

import express from 'express';
import { db } from '../firebaseAdmin.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { Timestamp } from 'firebase-admin/firestore';
import dayjs from 'dayjs';

const router = express.Router();

// Middleware to extract server ID
const getServerId = (req, res, next) => {
  req.serverId = req.headers['x-server-id'] || req.query.serverId;
  if (!req.serverId) {
    return res.status(400).json({ 
      message: 'Server ID is required via X-Server-ID header or serverId query parameter',
      example: '?serverId=Server-01'
    });
  }
  next();
};

router.get('/monthly', getServerId, async (req, res) => {
  try {
    const now = dayjs();
    const startOfMonth = now.startOf('month').toDate();
    const endOfMonth = now.endOf('month').toDate();

    const query = db.collection('systemMetrics')
  .where('agentId', '==', req.serverId)
  .where('createdAt', '>=', Timestamp.fromDate(startOfMonth))
  .where('createdAt', '<=', Timestamp.fromDate(endOfMonth))
  .orderBy('createdAt', 'asc');


    const snapshot = await query.get();

    const groupedByDay = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt.toDate();
      const day = dayjs(createdAt).format('YYYY-MM-DD');

      if (!groupedByDay[day]) {
        groupedByDay[day] = { up: 0, down: 0 };
      }

      if (data.status === 'up') groupedByDay[day].up++;
      else if (data.status === 'down') groupedByDay[day].down++;
    });

    const result = Object.entries(groupedByDay).map(([date, counts]) => ({
      date,
      uptime: parseFloat(((counts.up / (counts.up + counts.down)) * 100 || 0).toFixed(2)),
      totalChecks: counts.up + counts.down,
      serverId: req.serverId
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error aggregating monthly metrics:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve monthly metrics',
      serverId: req.serverId,
      error: error.message,
      hint: 'Ensure Firestore composite indexes are created for agentId and createdAt fields'
    });
  }
});

router.get('/', getServerId, async (req, res) => {
  try {
    const query = db.collection('systemMetrics')
      .where('agentId', '==', req.serverId)
      .orderBy('createdAt', 'desc')
      .limit(5);

    const snapshot = await query.get();
    const metrics = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      serverId: req.serverId
    })).reverse();

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve metrics',
      serverId: req.serverId,
      error: error.message,
      hint: 'Ensure Firestore composite indexes are created for agentId and createdAt fields'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { agentId, secret, metrics } = req.body;

    console.log(`[✓] Metrics sent at ${new Date().toLocaleTimeString()}`);
    console.log('[<] Server response status:', response.status);
    
    if (!agentId || !secret || !metrics) {
      return res.status(400).json({ 
        message: 'Missing required fields: agentId, secret, or metrics' 
      });
    }

    const allowedAgents = {
      'Server-01': 'superSecretKey123',
      'Server-02': 'anotherSecretKey456'
    };

    if (!allowedAgents[agentId] || allowedAgents[agentId] !== secret) {
      return res.status(403).json({ 
        message: 'Unauthorized agent',
        receivedAgentId: agentId
      });
    }

    const metricData = {
      ...metrics,
      agentId,
      createdAt: Timestamp.now(),
      status: metrics.status || 'up'
    };

    await db.collection('systemMetrics').add(metricData);
    res.status(200).json({ 
      message: 'Metrics stored successfully',
      agentId
    });
  } catch (error) {
    console.error('Error storing system metrics:', error);
    res.status(500).json({ 
      message: 'Failed to store metrics',
      error: error.message
    });
  }
});

export default router;