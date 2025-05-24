// cron/uptimeTracker.js
import os from 'os';
import UptimeLog from '../Models/UptimeLog.js';

export const trackUptime = async () => {
  try {
    const uptime = os.uptime();
    const isUp = uptime > 60; // if uptime is more than 1 minute, system is up

    await UptimeLog.create({
      isUp,
      reason: isUp ? '' : 'Possible system reboot or service crash',
    });
  } catch (err) {
    console.error('Failed to track uptime:', err.message);
  }
};
