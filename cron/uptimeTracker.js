// // cron/uptimeTracker.js
// import os from 'os';
// import UptimeLog from '../Models/UptimeLog.js';

// export const trackUptime = async () => {
//   try {
//     const uptime = os.uptime();
//     const isUp = uptime > 60; // if uptime is more than 1 minute, system is up

//     await UptimeLog.create({
//       isUp,
//       reason: isUp ? '' : 'Possible system reboot or service crash',
//     });
//   } catch (err) {
//     console.error('Failed to track uptime:', err.message);
//   }
// };

// trackUptime.js
import os from 'os';
import { db } from '../firebaseAdmin.js'; // ✅ Admin SDK

export const trackUptime = async () => {
  try {
    const uptime = os.uptime();
    const isUp = uptime > 60; // if uptime > 1 min, system is up

    await db.collection('uptimeLogs').add({
      isUp,
      reason: isUp ? '' : 'Possible system reboot or service crash',
      timestamp: new Date(),
    });

  } catch (err) {
    console.error('Failed to track uptime:', err.message);
  }
};
