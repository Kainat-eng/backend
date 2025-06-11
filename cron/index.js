// import cron from 'node-cron';
// import collectMetrics from './collectMetrics.js';
// import { trackUptime } from './uptimeTracker.js';

// // Run every minute
// cron.schedule('* * * * *', async () => {
//   console.log('⏱️ Running metric + uptime jobs...');
//   await collectMetrics();
//   await trackUptime();
// });

import cron from 'node-cron';
import collectMetrics from './collectMetrics.js';
import { trackUptime } from './uptimeTracker.js';

cron.schedule('* * * * *', async () => {
  console.log('⏱️ Running metric + uptime jobs...');

  try {
    await collectMetrics();
  } catch (err) {
    console.error('Error in collectMetrics:', err);
  }

  try {
    await trackUptime();
  } catch (err) {
    console.error('Error in trackUptime:', err);
  }
});
