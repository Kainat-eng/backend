// helpers/roles.js
import { db } from '../firebaseConfig.js';
import {
  collection, getDocs, query, where, addDoc
} from 'firebase/firestore';

const rolesCol = collection(db, 'roles');

// Create default "user" role with permissions
export const createDefaultUserRole = async (permissionsRefs) => {
  const q = query(rolesCol, where('name', '==', 'user'));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    console.log('Default "user" role already exists.');
    return;
  }

  await addDoc(rolesCol, {
    name: 'user',
    permissions: permissionsRefs.map(ref => ref.ref)
  });

  console.log('Default "user" role created with permissions.');
};
