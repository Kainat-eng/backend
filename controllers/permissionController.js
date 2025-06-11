// import Permission from '../Models/Permission.js';

// // ✅ Create a new permission
// export const createPermission = async (req, res) => {
//     try {
//         const { name } = req.body;

//         const existing = await Permission.findOne({ name });
//         if (existing) return res.status(400).json({ message: 'Permission already exists' });

//         const permission = await Permission.create({ name });
//         res.status(201).json({ success: true, permission });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating permission', error });
//     }
// };

// // ✅ Get all permissions
// export const getAllPermissions = async (req, res) => {
//     try {
//         const permissions = await Permission.find({});
//         res.json({ success: true, permissions });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching permissions', error });
//     }
// };

// // ✅ Update a permission
// export const updatePermission = async (req, res) => {
//     try {
//         const { name } = req.body;
//         const permission = await Permission.findByIdAndUpdate(
//             req.params.id,
//             { name },
//             { new: true }
//         );

//         if (!permission) return res.status(404).json({ message: 'Permission not found' });

//         res.json({ success: true, permission });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating permission', error });
//     }
// };

// // ✅ Delete a permission
// export const deletePermission = async (req, res) => {
//     try {
//         const permission = await Permission.findByIdAndDelete(req.params.id);
//         if (!permission) return res.status(404).json({ message: 'Permission not found' });

//         res.json({ success: true, message: 'Permission deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting permission', error });
//     }
// };

import { db } from '../firebaseAdmin.js'; // Your Firebase Admin SDK Firestore instance

// Create a new permission
export const createPermission = async (req, res) => {
  try {
    const { name } = req.body;

    // Check for duplicate permission
    const snapshot = await db.collection('permissions').where('name', '==', name).get();

    if (!snapshot.empty) {
      return res.status(400).json({ message: 'Permission already exists' });
    }

    const newDocRef = await db.collection('permissions').add({ name });
    res.status(201).json({ success: true, permission: { id: newDocRef.id, name } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating permission', error: error.message });
  }
};

// Get all permissions
export const getAllPermissions = async (_req, res) => {
  try {
    const snapshot = await db.collection('permissions').get();
    const permissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, permissions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching permissions', error: error.message });
  }
};

// Update a permission
export const updatePermission = async (req, res) => {
  try {
    const { name } = req.body;
    const permissionDocRef = db.collection('permissions').doc(req.params.id);

    const docSnap = await permissionDocRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    await permissionDocRef.update({ name });
    res.json({ success: true, permission: { id: req.params.id, name } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating permission', error: error.message });
  }
};

// Delete a permission
export const deletePermission = async (req, res) => {
  try {
    const permissionDocRef = db.collection('permissions').doc(req.params.id);

    const docSnap = await permissionDocRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    await permissionDocRef.delete();
    res.json({ success: true, message: 'Permission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting permission', error: error.message });
  }
};
