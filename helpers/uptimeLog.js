// helpers/uptimeLog.js
import { db } from '../firebaseConfig.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';

const uptimeLogCol = collection(db, 'uptimeLogs');

// ✅ Add a new uptime log
export const addUptimeLog = async ({ isUp, reason = '' }) => {
  const docRef = await addDoc(uptimeLogCol, {
    timestamp: Timestamp.fromDate(new Date()),
    isUp,
    reason
  });
  return docRef.id;
};

// ✅ Get all logs (optional: sorted)
export const getAllUptimeLogs = async () => {
  const q = query(uptimeLogCol, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
