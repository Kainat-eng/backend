import si from 'systeminformation';
import SystemMetric from '../Models/SystemMetric.js';

async function collectMetrics() {
  try {
    const [cpu, mem, disk, network, currentLoad] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.currentLoad()
    ]);

    await SystemMetric.create({ cpu, mem, disk, network, currentLoad });
    console.log('System metrics saved successfully');
  } catch (err) {
    console.error('Error collecting metrics:', err);
  }
}

export default collectMetrics;
