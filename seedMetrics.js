import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SystemMetric from './Models/SystemMetric.js'; // Adjust path if needed

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const now = new Date();

    for (let i = 0; i < 10; i++) {
      await SystemMetric.create({
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        diskUsage: Math.random() * 100,
        networkIn: Math.random() * 1000,
        networkOut: Math.random() * 1000,
        createdAt: new Date(now.getFullYear(), now.getMonth(), 5 + i),
      });
    }

    console.log('✅ Seeded system metrics!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding metrics:', err.message);
    process.exit(1);
  }
};

seed();
