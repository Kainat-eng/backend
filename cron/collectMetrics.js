// import si from 'systeminformation';
// import SystemMetric from '../Models/SystemMetric.js';

// async function collectMetrics() {
//   try {
//     const [cpu, mem, disk, network, currentLoad] = await Promise.all([
//       si.cpu(),
//       si.mem(),
//       si.fsSize(),
//       si.networkStats(),
//       si.currentLoad()
//     ]);

//     await SystemMetric.create({ cpu, mem, disk, network, currentLoad });
//     console.log('System metrics saved successfully');
//   } catch (err) {
//     console.error('Error collecting metrics:', err);
//   }
// }

// export default collectMetrics;

import si from 'systeminformation';
import { db, admin } from '../firebaseAdmin.js';  // Make sure admin is imported if needed
import { Timestamp } from 'firebase-admin/firestore';

async function collectMetrics() {
  try {
    const [cpu, mem, disk, network, currentLoad] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.currentLoad()
    ]);

    await db.collection('systemMetrics').add({
      cpu,
      mem,
      disk,
      network,
      currentLoad,
      agentId: 'server-pc',           // identify as your server PC
      createdAt: Timestamp.now(),     // Firestore timestamp type
      status: 'up'                    // optionally mark status, e.g. 'up'
    });

    console.log('System metrics saved successfully');
  } catch (err) {
    console.error('Error collecting metrics:', err);
  }
}

export default collectMetrics;
