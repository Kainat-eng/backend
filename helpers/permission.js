// helpers/permissions.js
import { db } from '../firebaseConfig.js';
import {
  collection, getDocs, addDoc, query, where, doc, deleteDoc
} from 'firebase/firestore';

const permissionsCol = collection(db, 'permissions');

// Get all permissions
export const getAllPermissions = async () => {
  const snapshot = await getDocs(permissionsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Create a permission if it doesn't exist
export const createPermissionIfNotExists = async (name) => {
  if (!name || name.trim() === '') return null;

  const q = query(permissionsCol, where('name', '==', name));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) return snapshot.docs[0];

  return await addDoc(permissionsCol, { name: name.trim() });
};

// Cleanup invalid permissions (e.g., empty or null names)
export const cleanInvalidPermissions = async () => {
  const snapshot = await getDocs(permissionsCol);
  for (const perm of snapshot.docs) {
    const { name } = perm.data();
    if (!name || name.trim() === '') {
      await deleteDoc(doc(db, 'permissions', perm.id));
    }
  }
};
