// helpers/serverLogs.js
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

const serverLogsCol = collection(db, 'serverLogs');

// ✅ Create a new log entry
export const createServerLog = async ({ serverId, cpuUsage, memoryUsage, diskSpace }) => {
  if (!serverId) throw new Error('serverId is required');

  const logData = {
    serverId,
    cpuUsage: cpuUsage ?? null,
    memoryUsage: memoryUsage ?? null,
    diskSpace: diskSpace ?? null,
    timestamp: Timestamp.now()
  };

  const docRef = await addDoc(serverLogsCol, logData);
  return docRef;
};

// ✅ Get all logs
export const getAllServerLogs = async () => {
  const snapshot = await getDocs(serverLogsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ Get logs for a specific server
export const getLogsByServerId = async (serverId) => {
  const q = query(serverLogsCol, where('serverId', '==', serverId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ Get a single log by ID
export const getServerLogById = async (id) => {
  const logRef = doc(db, 'serverLogs', id);
  const snapshot = await getDoc(logRef);
  if (!snapshot.exists()) throw new Error('Log not found');
  return { id: snapshot.id, ...snapshot.data() };
};
