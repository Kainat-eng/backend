import admin from './firebase.js';

const setRoleForUser = async (uid, role) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`Role "${role}" set for user with UID: ${uid}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
};

// Example usage:
// Replace with your users' UID and desired roles
const usersWithRoles = [
  { uid: 'firebase-uid-1', role: 'admin' },
  { uid: 'firebase-uid-2', role: 'server_admin' },
  { uid: 'firebase-uid-3', role: 'user' },
];

usersWithRoles.forEach(({ uid, role }) => setRoleForUser(uid, role));
