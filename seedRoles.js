// // seedRoles.js
// import mongoose from "mongoose";
// import dotenv from 'dotenv';
// import Role from "./Models/Role.js"; // adjust the path if needed

// dotenv.config();

// const roles = [
//   { name: "Admin", permissions: [] },
//   { name: "ServerAdmin", permissions: [] },
//   { name: "user", permissions: [] } // Important: this is needed for default registration
// ];

// const roleSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   permissions: [{ type: String }] // e.g. ['CREATE_SERVER', 'VIEW_USERS']
// });


// mongoose
//   .connect(process.env.DB_URI, {
//     // The options below are now deprecated, so you can remove them if you like
//   })
//   .then(async () => {
//     console.log("MongoDB connected");

//     await Role.deleteMany({});
//     await Role.insertMany(roles);

//     console.log("Roles seeded successfully!");
//     mongoose.disconnect();
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     mongoose.disconnect();
//   });

// seedRolesAndPermissions.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import serviceAccount from './config/serviceAccountKey.json' assert { type: 'json' };

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Permissions to seed
const permissionNames = [
  'create:user', 'read:user', 'update:user', 'delete:user', 'assign:role',
  'create:server', 'read:server', 'update:server', 'delete:server',
  'read:metrics'
];

// Role definitions with permission names (to resolve references later)
const rolesWithPermissions = {
  Admin: ['create:user', 'read:user', 'update:user', 'delete:user', 'assign:role'],
  ServerAdmin: ['create:server', 'read:server', 'update:server', 'delete:server'],
  user: ['read:metrics']
};

const seedRolesAndPermissions = async () => {
  try {
    const permissionsCollection = db.collection('permissions');
    const rolesCollection = db.collection('roles');

    // 1. Delete old permissions
    const oldPerms = await permissionsCollection.get();
    const batchDeletePerms = db.batch();
    oldPerms.forEach(doc => batchDeletePerms.delete(doc.ref));
    await batchDeletePerms.commit();

    // 2. Delete old roles
    const oldRoles = await rolesCollection.get();
    const batchDeleteRoles = db.batch();
    oldRoles.forEach(doc => batchDeleteRoles.delete(doc.ref));
    await batchDeleteRoles.commit();

    console.log('✅ Old permissions and roles cleared.');

    // 3. Add new permissions
    const permissionRefs = {}; // { 'read:user': docRef }
    const batchInsertPerms = db.batch();
    permissionNames.forEach(name => {
      const docRef = permissionsCollection.doc(); // Auto ID
      permissionRefs[name] = docRef;
      batchInsertPerms.set(docRef, { name });
    });
    await batchInsertPerms.commit();

    console.log('✅ Permissions added.');

    // 4. Add roles with permission references
    const batchInsertRoles = db.batch();
    for (const [roleName, permNames] of Object.entries(rolesWithPermissions)) {
      const docRef = rolesCollection.doc();
      const roleData = {
        name: roleName,
        permissions: permNames.map(p => permissionRefs[p]) // references
      };
      batchInsertRoles.set(docRef, roleData);
    }
    await batchInsertRoles.commit();

    console.log('✅ Roles added with permission references.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedRolesAndPermissions();
