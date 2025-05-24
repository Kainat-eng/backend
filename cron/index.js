import cron from 'node-cron';
import collectMetrics from './collectMetrics.js';
import { trackUptime } from './uptimeTracker.js';

// Run every minute
cron.schedule('* * * * *', async () => {
  console.log('⏱️ Running metric + uptime jobs...');
  await collectMetrics();
  await trackUptime();
});
