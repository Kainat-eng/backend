// import express from 'express';
// import systeminformation from 'systeminformation';
// import axios from 'axios';

// const router = express.Router();

// router.get('/system-metrics', async (req, res) => {
//   try {
//     const cpu = await systeminformation.cpu();
//     const currentLoad = await systeminformation.currentLoad();
//     const mem = await systeminformation.mem();
//     const disk = await systeminformation.fsSize();
//     const temperature = await systeminformation.cpuTemperature();
//     const network = await systeminformation.networkStats();
//     const uptime = await systeminformation.time();

//     // Step 1: Get Public IP
//     let locationData = {};
//     try {
//       console.log('Fetching Public IP...');
//       const ipResponse = await axios.get('https://api.ipify.org?format=json');
//       const publicIP = ipResponse.data.ip;
//       console.log('Fetched Public IP:', publicIP); // Logging public IP

//       // Step 2: Fetch Location based on IP
//       console.log('Fetching location data for IP:', publicIP);
//       const locResponse = await axios.get(`http://ip-api.com/json/${publicIP}`);
//       console.log('Location Data:', locResponse.data); // Logging location data

//       const loc = locResponse.data;
//       locationData = {
//         ip: publicIP,
//         city: loc.city,
//         region: loc.regionName,
//         country: loc.country,
//         lat: loc.lat,
//         lon: loc.lon,
//         isp: loc.isp,
//       };
//     } catch (locError) {
//       console.warn('Failed to fetch location data:', locError.message);
//       locationData = { error: 'Location data not available' };
//     }

//     // Sending the system metrics including location
//     res.json({
//       cpu,
//       currentLoad,
//       mem,
//       disk,
//       temperature,
//       network,
//       uptime,
//       location: locationData,
//     });
//   } catch (error) {
//     console.error('Error fetching system metrics:', error.message);
//     res.status(500).json({ error: 'Failed to fetch system metrics' });
//   }
// });

// // Monthly aggregated metrics route (optional for dashboard trends)
// router.get('/system-metrics/monthly', async (req, res) => {
//     try {
//       // Simulated monthly data
//       const sampleData = {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr'],
//         cpuUsage: [30, 40, 50, 35],
//         memoryUsage: [60, 55, 70, 65],
//         diskUsage: [50, 52, 48, 60],
//         networkIn: [120, 130, 140, 110],
//         networkOut: [100, 110, 90, 95],
//       };
//       res.json(sampleData);
//     } catch (error) {
//       console.error('Error fetching monthly metrics:', error.message);
//       res.status(500).json({ error: 'Failed to fetch monthly metrics' });
//     }
//   });
  

// export default router;

// import express from 'express';
// import UptimeLog from '../Models/UptimeLog.js';  // Adjust path as necessary
// import SystemMetric from '../Models/SystemMetric.js';
// import axios from 'axios';
// import os from 'os';  // Import os module to get uptime

// const router = express.Router();

// // GET /system-metrics - Fetch the latest system metrics (4-5 records)
// router.get('/system-metrics', async (req, res) => {
//   try {
//     console.log('Fetching system metrics...');

//     // Fetch latest 4-5 metrics from the database
//     const metrics = await SystemMetric.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .lean();

//     console.log('Fetched metrics:', metrics);

//     // Get the system uptime in seconds (from os module)
//     const uptime = os.uptime(); // System uptime in seconds

//     // Calculate downtime based on UptimeLogs
//     const totalLogs = await UptimeLog.countDocuments();  // Get total uptime logs
//     const downLogs = await UptimeLog.countDocuments({ isUp: false });  // Count downtime logs
//     const downtime = downLogs * 60;  // Assuming each downtime log represents 1 minute of downtime

//     // Attach uptime and downtime to the system metrics response
//     res.json({
//       metrics: metrics.reverse(), // Reverse the array so the most recent entry is first
//       uptime, // Include uptime
//       downtime, // Include downtime
//     });
//   } catch (error) {
//     console.error('Error fetching system metrics:', error);
//     res.status(500).json({ error: 'Failed to fetch system metrics' });
//   }
// });

// // GET /uptime/monthly - Calculate monthly uptime percentage and daily statistics
// router.get('/uptime/monthly', async (req, res) => {
//   try {
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//     console.log('Fetching uptime logs from:', startOfMonth);

//     // Fetch uptime logs for the current month
//     const logs = await UptimeLog.find({ timestamp: { $gte: startOfMonth } });

//     const totalLogs = logs.length;
//     const upLogs = logs.filter(log => log.isUp).length;
//     const uptimePercentage = totalLogs > 0 ? ((upLogs / totalLogs) * 100).toFixed(2) : 0;

//     // Generate daily uptime graph data
//     const dailyUptimeMap = {};

//     logs.forEach(log => {
//       const day = log.timestamp.toISOString().split('T')[0]; // Extract date from timestamp
//       if (!dailyUptimeMap[day]) dailyUptimeMap[day] = { up: 0, total: 0 };
//       dailyUptimeMap[day].total++;
//       if (log.isUp) dailyUptimeMap[day].up++;
//     });

//     const dailyUptime = Object.entries(dailyUptimeMap).map(([date, data]) => ({
//       date,
//       uptime: ((data.up / data.total) * 100).toFixed(2),
//     }));

//     res.json({
//       uptimePercentage,
//       dailyUptime,
//     });
//   } catch (error) {
//     console.error('Error calculating monthly uptime:', error);
//     res.status(500).json({ error: 'Failed to calculate uptime' });
//   }
// });

// // GET /uptime/incidents - Fetch the last 20 downtime incidents
// router.get('/uptime/incidents', async (req, res) => {
//   try {
//     // Fetch the last 20 downtime incidents
//     const incidents = await UptimeLog.find({ isUp: false })
//       .sort({ timestamp: -1 })
//       .limit(20);

//     res.json(incidents);
//   } catch (error) {
//     console.error('Error fetching downtime incidents:', error);
//     res.status(500).json({ error: 'Failed to fetch incidents' });
//   }
// });

// // OPTIONAL: GET /system-metrics/monthly - Aggregate monthly system metrics
// router.get('/system-metrics/monthly', async (req, res) => {
//     try {
//       const now = new Date();
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
  
//       console.log('Fetching system metrics for the month starting from:', startOfMonth);
  
//       // Fetch the system metrics for the current month
//       const metrics = await SystemMetric.find({
//         createdAt: { $gte: startOfMonth, $lt: endOfMonth },
//       });
  
//       console.log(metrics);  // <-- Add this line here to check the fetched data structure
  
//       if (!metrics.length) {
//         return res.json({ message: 'No metrics found for this month.' });
//       }
  
//       // Aggregate metrics for the current month
//       const monthlyData = metrics.reduce((acc, metric) => {
//         const date = metric.createdAt instanceof Date ? metric.createdAt : new Date(metric.createdAt);
//         const month = date.getMonth(); // Get the month number from the `createdAt` date
  
//         if (!acc[month]) {
//           acc[month] = {
//             cpuUsage: [],
//             memoryUsage: [],
//             diskUsage: [],
//             networkIn: [],
//             networkOut: [],
//           };
//         }
  
//         // Log the currentLoad to debug why cpuUsage might be null
//         console.log('currentLoad:', metric.currentLoad);  // Log currentLoad to check its structure
  
//         // Extract and aggregate values carefully
//         acc[month].cpuUsage.push(metric.currentLoad?.currentLoad || 0);  // Using the `currentLoad` for CPU load
//         acc[month].memoryUsage.push((metric.mem.used / metric.mem.total) * 100 || 0);  // Memory usage percentage
//         acc[month].diskUsage.push(metric.disk[0]?.used || 0);  // Assuming we take the first disk in the array
//         acc[month].networkIn.push(metric.network[0]?.bytesReceived || 0);  // Assuming you are tracking bytesReceived
//         acc[month].networkOut.push(metric.network[0]?.bytesSent || 0);  // Assuming you are tracking bytesSent
  
//         return acc;
//       }, {});
  
//       // Calculate averages for each metric
//       const averages = Object.keys(monthlyData).map(month => ({
//         month,
//         cpuUsage: average(monthlyData[month].cpuUsage),
//         memoryUsage: average(monthlyData[month].memoryUsage),
//         diskUsage: average(monthlyData[month].diskUsage),
//         networkIn: average(monthlyData[month].networkIn),
//         networkOut: average(monthlyData[month].networkOut),
//       }));
  
//       // Helper function to calculate the average of an array
//       function average(arr) {
//         return arr.reduce((sum, value) => sum + value, 0) / arr.length;
//       }
  
//       res.json(averages);
//     } catch (error) {
//       console.error('Error fetching monthly metrics:', error.message);
//       res.status(500).json({ error: 'Failed to fetch monthly metrics' });
//     }
//   });
  

// // GET /system-location - Fetch system location based on IP (external API)
// router.get('/system-location', async (req, res) => {
//   try {
//     const locationResponse = await axios.get('http://ip-api.com/json/');
//     console.log('Location response:', locationResponse.data); // Add this to debug
//     const locationData = locationResponse.data;

//     res.json({
//       city: locationData.city,
//       region: locationData.regionName,
//       country: locationData.country,
//       isp: locationData.isp,
//     });
//   } catch (error) {
//     console.error('Error fetching system location:', error.message);
//     res.status(500).json({ error: 'Failed to fetch system location' });
//   }
// });

// export default router;


import express from 'express';
import { db } from '../firebaseAdmin.js'; // Firestore instance from Firebase Admin SDK
import axios from 'axios';
import os from 'os';  // for local system uptime (optional)

const router = express.Router();

// GET /system-metrics - latest 5 system metrics
router.get('/system-metrics', async (req, res) => {
  try {
    const snapshot = await db.collection('systemMetrics')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    const metrics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();

    // Optional: use local os uptime, or you can store uptime in Firestore as well
    const uptime = os.uptime();

    // Count downtime logs from Firestore
    const totalLogsSnapshot = await db.collection('uptimeLogs').get();
    const downLogsSnapshot = await db.collection('uptimeLogs').where('isUp', '==', false).get();

    const downtime = downLogsSnapshot.size * 60; // assuming 1 log = 1 min downtime

    res.json({ metrics, uptime, downtime });
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    res.status(500).json({ error: 'Failed to fetch system metrics' });
  }
});

// GET /uptime/monthly - monthly uptime stats
router.get('/uptime/monthly', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const logsSnapshot = await db.collection('uptimeLogs')
      .where('timestamp', '>=', startOfMonth)
      .get();

    const logs = logsSnapshot.docs.map(doc => doc.data());

    const totalLogs = logs.length;
    const upLogs = logs.filter(log => log.isUp).length;
    const uptimePercentage = totalLogs > 0 ? ((upLogs / totalLogs) * 100).toFixed(2) : 0;

    const dailyUptimeMap = {};

    logs.forEach(log => {
      const day = log.timestamp.toDate().toISOString().split('T')[0];
      if (!dailyUptimeMap[day]) dailyUptimeMap[day] = { up: 0, total: 0 };
      dailyUptimeMap[day].total++;
      if (log.isUp) dailyUptimeMap[day].up++;
    });

    const dailyUptime = Object.entries(dailyUptimeMap).map(([date, data]) => ({
      date,
      uptime: ((data.up / data.total) * 100).toFixed(2),
    }));

    res.json({ uptimePercentage, dailyUptime });
  } catch (error) {
    console.error('Error calculating monthly uptime:', error);
    res.status(500).json({ error: 'Failed to calculate uptime' });
  }
});

// GET /uptime/incidents - last 20 downtime incidents
router.get('/uptime/incidents', async (req, res) => {
  try {
    const incidentsSnapshot = await db.collection('uptimeLogs')
      .where('isUp', '==', false)
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const incidents = incidentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(incidents);
  } catch (error) {
    console.error('Error fetching downtime incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// GET /system-metrics/monthly - aggregate monthly metrics
router.get('/system-metrics/monthly', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const snapshot = await db.collection('systemMetrics')
      .where('createdAt', '>=', startOfMonth)
      .where('createdAt', '<', endOfMonth)
      .get();

    if (snapshot.empty) {
      return res.json({ message: 'No metrics found for this month.' });
    }

    const metrics = snapshot.docs.map(doc => doc.data());

    // Aggregation logic
    const monthlyData = {
      cpuUsage: [],
      memoryUsage: [],
      diskUsage: [],
      networkIn: [],
      networkOut: [],
    };

    metrics.forEach(metric => {
      monthlyData.cpuUsage.push(metric.currentLoad?.currentLoad || 0);
      monthlyData.memoryUsage.push((metric.mem.used / metric.mem.total) * 100 || 0);
      monthlyData.diskUsage.push(metric.disk[0]?.used || 0);
      monthlyData.networkIn.push(metric.network[0]?.bytesReceived || 0);
      monthlyData.networkOut.push(metric.network[0]?.bytesSent || 0);
    });

    const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    res.json({
      cpuUsage: average(monthlyData.cpuUsage),
      memoryUsage: average(monthlyData.memoryUsage),
      diskUsage: average(monthlyData.diskUsage),
      networkIn: average(monthlyData.networkIn),
      networkOut: average(monthlyData.networkOut),
    });
  } catch (error) {
    console.error('Error fetching monthly metrics:', error);
    res.status(500).json({ error: 'Failed to fetch monthly metrics' });
  }
});

// GET /system-location - external API to get location
router.get('/system-location', async (req, res) => {
  try {
    const locationResponse = await axios.get('http://ip-api.com/json/');
    const locationData = locationResponse.data;

    res.json({
      city: locationData.city,
      region: locationData.regionName,
      country: locationData.country,
      isp: locationData.isp,
    });
  } catch (error) {
    console.error('Error fetching system location:', error);
    res.status(500).json({ error: 'Failed to fetch system location' });
  }
});

export default router;
