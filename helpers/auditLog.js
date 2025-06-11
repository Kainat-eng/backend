// helpers/auditLog.js
import { db } from '../firebase.js'; // your Firebase init
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const createAuditLog = async ({ action, userId, details }) => {
  try {
    await addDoc(collection(db, 'auditLogs'), {
      action,
      userId,
      details: details || '',
      timestamp: Timestamp.now()
    });
    console.log('✅ Audit log saved');
  } catch (error) {
    console.error('❌ Error saving audit log:', error);
  }
};
