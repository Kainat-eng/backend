// helpers/tokenBlacklist.js
import { db } from '../firebaseConfig.js';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';

const blacklistCol = collection(db, 'tokenBlacklist');

// ✅ Add token to blacklist
export const blacklistToken = async (token, expiredAt) => {
  const docRef = await addDoc(blacklistCol, {
    token,
    expiredAt: Timestamp.fromDate(new Date(expiredAt))
  });
  return docRef.id;
};

// ✅ Check if a token is blacklisted
export const isTokenBlacklisted = async (token) => {
  const q = query(blacklistCol, where('token', '==', token));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// ✅ (Optional) Clean expired tokens
export const removeExpiredTokens = async () => {
  const now = new Date();
  const q = query(blacklistCol, where('expiredAt', '<=', Timestamp.fromDate(now)));
  const snapshot = await getDocs(q);
  const batch = snapshot.docs.map((docSnap) => deleteDoc(doc(db, 'tokenBlacklist', docSnap.id)));
  await Promise.all(batch);
};
