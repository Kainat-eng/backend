// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import SystemMetric from './Models/SystemMetric.js'; // Adjust path if needed

// dotenv.config();

// const seed = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const now = new Date();

//     for (let i = 0; i < 10; i++) {
//       await SystemMetric.create({
//         cpuUsage: Math.random() * 100,
//         memoryUsage: Math.random() * 100,
//         diskUsage: Math.random() * 100,
//         networkIn: Math.random() * 1000,
//         networkOut: Math.random() * 1000,
//         createdAt: new Date(now.getFullYear(), now.getMonth(), 5 + i),
//       });
//     }

//     console.log('✅ Seeded system metrics!');
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error seeding metrics:', err.message);
//     process.exit(1);
//   }
// };

// seed();

import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

import serviceAccount from './path/to/firebaseServiceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const seed = async () => {
  try {
    const now = new Date();

    const batch = db.batch();
    const collectionRef = db.collection('systemMetrics');

    for (let i = 0; i < 10; i++) {
      const docRef = collectionRef.doc(); // auto-generated ID

      // Use timestamp for createdAt (Firestore stores Timestamp objects)
      const createdAt = new Date(now.getFullYear(), now.getMonth(), 5 + i);

      batch.set(docRef, {
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        diskUsage: Math.random() * 100,
        networkIn: Math.random() * 1000,
        networkOut: Math.random() * 1000,
        createdAt: admin.firestore.Timestamp.fromDate(createdAt),
      });
    }

    await batch.commit();

    console.log('✅ Seeded system metrics in Firestore!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding metrics:', err.message);
    process.exit(1);
  }
};

seed();
