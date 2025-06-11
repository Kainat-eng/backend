// import Users from '../Models/User.js';

// const checkPermission = (requiredPermission) => async (req, res, next) => {
//     try {
//         const user = await Users.findById(req.user.id).populate({
//             path: 'role',
//             populate: { path: 'permissions' }
//         });

//         const userPermissions = user.role.permissions.map(p => p.name);

//         if (!userPermissions.includes(requiredPermission)) {
//             return res.status(403).json({ message: 'Forbidden: You do not have the required permission' });
//         }

//         next();
//     } catch (error) {
//         res.status(500).json({ message: 'Permission check failed', error });
//     }
// };

// export default checkPermission;

// import Users from '../Models/User.js';

// const checkPermission = (requiredPermission) => async (req, res, next) => {
//     try {
//         const user = await Users.findById(req.user.id).populate({
//             path: 'role',
//             populate: { path: 'permissions' }
//         });

//         const userPermissions = user.role.permissions.map(p => p.name);

//         if (!userPermissions.includes(requiredPermission)) {
//             return res.status(403).json({ message: 'Forbidden: You do not have the required permission' });
//         }

//         next();
//     } catch (error) {
//         res.status(500).json({ message: 'Permission check failed', error });
//     }
//     try {
//         const user = await Users.findById(req.user.id).populate({
//             path: 'role',
//             populate: { path: 'permissions' }
//         });

//         if (!user || !user.role || !user.role.permissions) {
//             return res.status(500).json({ message: 'Role or permissions not found' });
//         }

//         const userPermissions = user.role.permissions.map(p => p.name);

//         if (!userPermissions.includes(requiredPermission)) {
//             return res.status(403).json({ message: 'Forbidden: You do not have the required permission' });
//         }

//         next();
//     } catch (error) {
//         res.status(500).json({ message: 'Permission check failed', error });
//     }
// };

// export default checkPermission;

import { doc, getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../firebaseAdmin.js'; // ✅ CORRECT


const checkPermission = (requiredPermission) => async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return res.status(404).json({ message: 'User not found' });

    const userData = userSnap.data();
    if (!userData.roleId) return res.status(500).json({ message: 'User has no role assigned' });

    const roleRef = doc(db, 'roles', userData.roleId);
    const roleSnap = await getDoc(roleRef);
    if (!roleSnap.exists()) return res.status(404).json({ message: 'Role not found' });

    const roleData = roleSnap.data();
    const permissionIds = roleData.permissions || [];
    if (permissionIds.length === 0) return res.status(403).json({ message: 'No permissions assigned to role' });

    // Batch fetch permissions
    const permissionsCollection = collection(db, 'permissions');
    // Firestore where in can accept max 10 values; handle accordingly if you expect more
    const q = query(permissionsCollection, where('__name__', 'in', permissionIds.slice(0, 10)));
    const permsSnapshot = await getDocs(q);

    const permissionNames = permsSnapshot.docs.map(doc => doc.data().name);

    if (!permissionNames.includes(requiredPermission)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required permission' });
    }

    next();
  } catch (error) {
    console.error('Permission check error:', error);
    res.status(500).json({ message: 'Permission check failed', error: error.message });
  }
};

export default checkPermission;
