// helpers/userPermission.js
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
  where
} from 'firebase/firestore';

const userPermissionsCol = collection(db, 'userPermissions');

// Create a new user permission document
export const createUserPermission = async ({ userId, permissions = [] }) => {
  const docRef = await addDoc(userPermissionsCol, {
    userId, // string ID referencing user document
    permissions, // array of { permission_name: string, permission_value: string[] }
  });
  return docRef.id;
};

// Get user permissions by userId
export const getUserPermissionByUserId = async (userId) => {
  const q = query(userPermissionsCol, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  // Assuming one doc per userId
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
};

// Update user permissions by document ID
export const updateUserPermission = async (id, updates) => {
  await updateDoc(doc(userPermissionsCol, id), updates);
};

// Delete user permissions by document ID
export const deleteUserPermission = async (id) => {
  await deleteDoc(doc(userPermissionsCol, id));
};
