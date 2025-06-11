import { db } from './firebaseAdmin.js';

async function testFirestore() {
  try {
    await db.collection('test').doc('testDoc').set({ test: 'success', timestamp: Date.now() });
    console.log('Test document written successfully');
  } catch (error) {
    console.error('Error writing test document:', error);
  }
}

testFirestore();
