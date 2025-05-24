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

import Users from '../Models/User.js';

const checkPermission = (requiredPermission) => async (req, res, next) => {
    try {
        const user = await Users.findById(req.user.id).populate({
            path: 'role',
            populate: { path: 'permissions' }
        });

        const userPermissions = user.role.permissions.map(p => p.name);

        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required permission' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Permission check failed', error });
    }
    try {
        const user = await Users.findById(req.user.id).populate({
            path: 'role',
            populate: { path: 'permissions' }
        });

        if (!user || !user.role || !user.role.permissions) {
            return res.status(500).json({ message: 'Role or permissions not found' });
        }

        const userPermissions = user.role.permissions.map(p => p.name);

        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required permission' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Permission check failed', error });
    }
};

export default checkPermission;
