// helpers/systemMetric.js
import { db } from '../firebaseConfig.js';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

const systemMetricCol = collection(db, 'systemMetrics');

// ✅ Add a new system metric entry
export const addSystemMetric = async (metricData) => {
  const docRef = await addDoc(systemMetricCol, {
    ...metricData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

// ✅ Get all system metrics (optional: limit)
export const getSystemMetrics = async (limitTo = 50) => {
  const q = query(systemMetricCol, orderBy('createdAt', 'desc'), limit(limitTo));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ Get a single system metric by ID
export const getSystemMetricById = async (id) => {
  const ref = doc(db, 'systemMetrics', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) throw new Error('System metric not found');
  return { id: snapshot.id, ...snapshot.data() };
};
