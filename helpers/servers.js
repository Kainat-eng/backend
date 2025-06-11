// helpers/servers.js
import { db } from '../firebaseConfig.js';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

const serversCol = collection(db, 'servers');

// ✅ Create a new server
export const createServer = async ({ name, ip, location, status = 'offline', createdBy }) => {
  if (!name || !ip || !createdBy) throw new Error('Missing required server fields');

  const serverData = {
    name,
    ip,
    location: location || '',
    status: ['online', 'offline', 'maintenance'].includes(status) ? status : 'offline',
    createdBy,
    createdAt: Timestamp.now()
  };

  const docRef = await addDoc(serversCol, serverData);
  return docRef;
};

// ✅ Get all servers
export const getAllServers = async () => {
  const snapshot = await getDocs(serversCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ Get a server by ID
export const getServerById = async (id) => {
  const docRef = doc(db, 'servers', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) throw new Error('Server not found');
  return { id: snapshot.id, ...snapshot.data() };
};

// ✅ Update a server
export const updateServer = async (id, updateData) => {
  const docRef = doc(db, 'servers', id);
  await updateDoc(docRef, updateData);
};

// ✅ Delete a server
export const deleteServer = async (id) => {
  const docRef = doc(db, 'servers', id);
  await deleteDoc(docRef);
};

// ✅ Query servers by creator
export const getServersByUser = async (userId) => {
  const q = query(serversCol, where('createdBy', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
