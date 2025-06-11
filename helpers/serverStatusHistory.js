// helpers/serverStatusHistory.js
import { db } from '../firebaseConfig.js';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp
} from 'firebase/firestore';

const serverStatusHistoryCol = collection(db, 'serverStatusHistory');

// ✅ Create a new status history entry
export const createServerStatusHistory = async ({ serverId, status, startTime, endTime = null }) => {
  if (!serverId || !status || !startTime) throw new Error('Missing required fields');

  const statusData = {
    serverId,
    status,
    startTime: Timestamp.fromDate(new Date(startTime)),
    endTime: endTime ? Timestamp.fromDate(new Date(endTime)) : null,
  };

  const docRef = await addDoc(serverStatusHistoryCol, statusData);
  return docRef.id;
};

// ✅ Get all server status history
export const getAllServerStatusHistory = async () => {
  const snapshot = await getDocs(serverStatusHistoryCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ Get history for a specific server
export const getServerStatusHistoryByServerId = async (serverId) => {
  const q = query(serverStatusHistoryCol, where('serverId', '==', serverId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ Get a single entry by ID
export const getServerStatusHistoryById = async (id) => {
  const ref = doc(db, 'serverStatusHistory', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) throw new Error('Status history entry not found');
  return { id: snapshot.id, ...snapshot.data() };
};
