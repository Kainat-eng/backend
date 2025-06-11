// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import Role from './Models/Role.js';
// import User from './Models/User.js';
// import bcrypt from 'bcryptjs';

// dotenv.config();

// const createRoles = async () => {
//     const roles = [
//         { name: 'Admin', permissions: [] },
//         { name: 'ServerAdmin', permissions: [] },
//         { name: 'user', permissions: [] },
//     ];

//     await Role.deleteMany({});
//     await Role.insertMany(roles);
//     console.log('✅ Roles seeded successfully');
// };

// const createAdminUsers = async () => {
//     const adminRole = await Role.findOne({ name: 'Admin' });
//     const serverAdminRole = await Role.findOne({ name: 'ServerAdmin' });

//     if (!adminRole || !serverAdminRole) {
//         console.log('❌ Roles must be seeded first');
//         return;
//     }

//     const hashedAdminPassword = await bcrypt.hash('abc123', 10);
//     const hashedServerAdminPassword = await bcrypt.hash('abc123', 10);

//     const existingAdmin = await User.findOne({ email: 'kainat@servereye.com' });
//     if (!existingAdmin) {
//         await User.create({
//             firstname: 'Kainat',
//             lastname: 'Ahmed',
//             email: 'kainat@servereye.com',
//             password: hashedAdminPassword,
//             role: adminRole._id,
//         });
//         console.log('✅ Admin user created');
//     } else {
//         console.log('ℹ️ Admin user already exists');
//     }

//     const existingServerAdmin = await User.findOne({ email: 'serveradmin@example.com' });
//     if (!existingServerAdmin) {
//         await User.create({
//             firstname: 'Server',
//             lastname: 'Admin',
//             email: 'serveradmin@example.com',
//             password: hashedServerAdminPassword,
//             role: serverAdminRole._id,
//         });
//         console.log('✅ ServerAdmin user created');
//     } else {
//         console.log('ℹ️ ServerAdmin user already exists');
//     }
// };

// const seedData = async () => {
//     try {
//         await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('🔌 MongoDB connected');

//         await createRoles();
//         await createAdminUsers();

//         await mongoose.disconnect();
//         process.exit(0);
//     } catch (error) {
//         console.error('❌ Seeding error:', error);
//         process.exit(1);
//     }
// };

// seedData();

import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

import serviceAccount from './config/serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

const roles = [
  { name: 'Admin', permissions: [] },
  { name: 'ServerAdmin', permissions: [] },
  { name: 'user', permissions: [] }, // default role
];

async function createRoles() {
  const batch = db.batch();
  const rolesCollection = db.collection('roles');

  // WARNING: No deletion of old roles here — if needed, add batch delete logic.

  roles.forEach(role => {
    // Let Firestore generate IDs for roles (auto ID)
    // Or you can keep your current method of manual IDs if you prefer
    // Here, to preserve existing IDs, let's just add if not exists:
    // But for simplicity, just overwrite by role name as ID:

    // Using role name as doc ID is optional but your existing data uses auto IDs
    // So here we add only if not exists
    // But for seeding simplicity, we will create with auto IDs

    // So let's add roles with auto IDs only if they don't exist:
  });

  // Instead, check if roles already exist to avoid duplicates
  const existingRolesSnapshot = await rolesCollection.get();
  if (!existingRolesSnapshot.empty) {
    console.log('ℹ️ Roles already seeded, skipping role creation');
    return;
  }

  // Add roles with auto-generated IDs
  for (const role of roles) {
    await rolesCollection.add(role);
  }

  console.log('✅ Roles seeded successfully');
}

async function createAdminUsers() {
  // Fetch roles from Firestore and map role names to their doc IDs
  const rolesSnapshot = await db.collection('roles').get();
  const roleNameToId = {};
  rolesSnapshot.forEach(doc => {
    const data = doc.data();
    roleNameToId[data.name] = doc.id;
  });

  if (!roleNameToId['Admin'] || !roleNameToId['ServerAdmin']) {
    console.error('❌ Roles must be seeded first');
    process.exit(1);
  }

  // Create or fetch Admin user
  let adminUser;
  try {
    adminUser = await auth.getUserByEmail('kainat@servereye.com');
    console.log('ℹ️ Admin user already exists in Auth');
  } catch {
    adminUser = await auth.createUser({
      email: 'kainat@servereye.com',
      password: 'abc123', // Change in production!
      displayName: 'Kainat Ahmed',
    });
    console.log('✅ Admin user created in Auth');
  }

  await db.collection('users').doc(adminUser.uid).set({
    firstname: 'Kainat',
    lastname: 'Ahmed',
    email: 'kainat@servereye.com',
    roleId: roleNameToId['Admin'], // Store role document ID here
    firebaseUid: adminUser.uid,
    createdAt: Date.now(),
  }, { merge: true });

  // Create or fetch ServerAdmin user
  let serverAdminUser;
  try {
    serverAdminUser = await auth.getUserByEmail('serveradmin@example.com');
    console.log('ℹ️ ServerAdmin user already exists in Auth');
  } catch {
    serverAdminUser = await auth.createUser({
      email: 'serveradmin@example.com',
      password: 'abc123', // Change in production!
      displayName: 'Server Admin',
    });
    console.log('✅ ServerAdmin user created in Auth');
  }

  await db.collection('users').doc(serverAdminUser.uid).set({
    firstname: 'Server',
    lastname: 'Admin',
    email: 'serveradmin@example.com',
    roleId: roleNameToId['ServerAdmin'], // Store role document ID here
    firebaseUid: serverAdminUser.uid,
    createdAt: Date.now(),
  }, { merge: true });
}

async function seedData() {
  try {
    await createRoles();
    await createAdminUsers();
    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedData();
