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

const usersCol = collection(db, 'users');

// Create a new user (without password in Firestore)
export const createUser = async ({ firebaseUid, firstname = null, lastname = null, email, role = 'user', token = null }) => {
  const docRef = await addDoc(usersCol, {
    firebaseUid,
    firstname,
    lastname,
    email,
    role,
    token
  });
  return docRef.id;
};

// Get user by Firestore doc ID
export const getUserById = async (id) => {
  const docSnap = await getDoc(doc(usersCol, id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Get user by email (assumes email unique)
export const getUserByEmail = async (email) => {
  const q = query(usersCol, where('email', '==', email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
};

// Update user by doc ID
export const updateUser = async (id, updates) => {
  await updateDoc(doc(usersCol, id), updates);
};

// Delete user by doc ID
export const deleteUser = async (id) => {
  await deleteDoc(doc(usersCol, id));
};
