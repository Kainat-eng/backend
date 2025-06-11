// // Models/Permission.js
// import mongoose from 'mongoose';

// const permissionSchema = new mongoose.Schema({
//   permissions: [
//     {
//       name: { type: String, required: true, unique: true }, // e.g. "read:server"
//       description: { type: String }
//     }
//   ]
// });

// const Permission = mongoose.model("Permission", permissionSchema);
// export default Permission;

// import mongoose from 'mongoose';
// import Role from './Role.js'; // Assuming Role also uses default export

// // Define Permission Schema with enhanced validation
// const permissionSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Permission name is required'],
//     unique: true,
//     trim: true, // Trims any extra spaces
//     validate: {
//       validator: function (v) {
//         return v && v.trim().length > 0; // Ensures name is not empty or just spaces
//       },
//       message: 'Permission name cannot be empty or just spaces',
//     }
//   }
// });

// // Create Permission Model
// const Permission = mongoose.model('Permission', permissionSchema);

// // Seeder logic to create default permissions and roles
// const createPermissionsAndRoles = async () => {
//   // Define default permissions
//   const permissions = ['read:user', 'write:user'];
//   console.log('Seeding permissions:', permissions);

//   // Remove invalid data (e.g., null or empty names) from the database
//   await Permission.deleteMany({ name: null });
//   await Permission.deleteMany({ name: '' });
//   console.log('Cleaned up invalid permissions from DB.');

//   // Get existing permissions from the database
//   const existingPermissions = await Permission.find({ name: { $in: permissions } });
//   const existingPermissionNames = new Set(existingPermissions.map(p => p.name));

//   console.log('Existing permissions:', [...existingPermissionNames]);

//   // Create permissions if they don't exist
//   for (const permissionName of permissions) {
//     if (!existingPermissionNames.has(permissionName) && permissionName.trim() !== '') {
//       try {
//         await Permission.create({ name: permissionName });
//         console.log(`Permission "${permissionName}" created.`);
//       } catch (error) {
//         console.warn(`Failed to create permission "${permissionName}":`, error.message);
//       }
//     } else {
//       console.warn('Skipping existing permission:', permissionName);
//     }
//   }

//   // Check if the default 'user' role exists
//   let defaultRole = await Role.findOne({ name: 'user' });

//   // Create the default 'user' role if it doesn't exist
//   if (!defaultRole) {
//     const permissionsForRole = await Permission.find({ name: { $in: permissions } });
//     defaultRole = new Role({
//       name: 'user',
//       permissions: permissionsForRole.map(p => p._id),
//     });

//     try {
//       await defaultRole.save();
//       console.log('Default "user" role created with permissions.');
//     } catch (error) {
//       console.warn('Failed to create default "user" role:', error.message);
//     }
//   } else {
//     console.log('Default "user" role already exists.');
//   }
// };

// // Run the seeding function
// createPermissionsAndRoles().catch(err => console.error('Error during seeding:', err));

// export default Permission;