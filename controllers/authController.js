// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import Users from '../Models/User.js';
// import Role from '../Models/Role.js';

// // Register a new user
// export const registerUser = async (req, res) => {
//     try {
//         const { firstname, lastname, email, password } = req.body;

//         // Check if user already exists
//         const existingUser = await Users.findOne({ email });
//         if (existingUser) {
//             return res.status(401).send('User already exists with this email');
//         }

//         // Assign default role
//         const defaultRole = await Role.findOne({ name: 'user' });
//         if (!defaultRole) {
//             return res.status(500).json({ message: 'Default user role not found' });
//         }

//         // Hash password before storing
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create user
//         const user = await Users.create({
//             firstname,
//             lastname,
//             email,
//             password: hashedPassword,
//             role: defaultRole._id,
//         });

//         // Create JWT token
//         const token = jwt.sign(
//             { id: user._id, email, role: defaultRole.name },
//             process.env.JWT_SECRET,
//             { expiresIn: '2h' }
//         );

//         user.token = token;
//         user.password = undefined;  // Hide the password in the response

//         res.status(201).json({ success: true, user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error registering user', error });
//     }
// };

// // User login
// export const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Find user with populated role and permissions
//         const user = await Users.findOne({ email }).populate({
//             path: 'role',
//             populate: { path: 'permissions' },
//         });

//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             { id: user._id, role: user.role.name },
//             process.env.JWT_SECRET,
//             { expiresIn: '2h' }
//         );

//         // Cookie options
//         const options = {
//             expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Lax',
//         };

//         user.password = undefined;

//         // Set cookie with token and return user info
//         return res.status(200).cookie('token', token, options).json({
//             success: true,
//             token,
//             user: {
//                 _id: user._id,
//                 email: user.email,
//                 role: user.role.name,
//                 permissions: user.role.permissions.map(p => p.name),
//             },
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in', error });
//     }
// };

// // Assign a role to a user by role name
// export const assignRole = async (req, res) => {
//     try {
//         const { roleName } = req.body;

//         // Find role by name
//         const role = await Role.findOne({ name: roleName });
//         if (!role) return res.status(404).json({ message: 'Role not found' });

//         // Update user's role
//         const user = await Users.findByIdAndUpdate(
//             req.params.id,
//             { role: role._id },
//             { new: true }
//         ).populate('role');

//         if (!user) return res.status(404).json({ message: 'User not found' });

//         res.json({ message: 'Role assigned successfully', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error assigning role', error });
//     }
// };

// // Get all users
// export const getAllUsers = async (_req, res) => {
//     try {
//         const users = await Users.find().select('-password');
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching users', error });
//     }
// };

// // Update user
// export const updateUser = async (req, res) => {
//     const { id } = req.params;
//     const { firstname, lastname, email, password } = req.body;

//     try {
//         const updateData = { firstname, lastname, email };
//         if (password) {
//             updateData.password = await bcrypt.hash(password, 10);
//         }

//         const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.json({ message: 'User updated successfully', user: updatedUser });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating user', error });
//     }
// };

// // Admin dashboard (test route)
// export const adminDashboard = (_req, res) => {
//     res.json({ message: 'Welcome to Admin Dashboard!' });
// };

import { db, auth } from '../firebaseAdmin.js'; // Clean imports
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper: Fetch role and its permissions by role name
const getRoleByNameWithPermissions = async (roleName) => {
  const rolesRef = db.collection('roles');
  const querySnapshot = await rolesRef.where('name', '==', roleName).get();

  if (querySnapshot.empty) return null;

  const roleDoc = querySnapshot.docs[0];
  const roleData = roleDoc.data();

  const permissions = [];
  if (Array.isArray(roleData.permissions)) {
    for (const permRef of roleData.permissions) {
      const permSnap = await permRef.get();
      if (permSnap.exists) permissions.push(permSnap.data().name);
    }
  }

  return { id: roleDoc.id, ...roleData, permissions };
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    console.log('Starting user registration');

    const idToken = req.headers.authorization?.split(' ')[1];
    if (!idToken) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    console.log('Decoded token:', decodedToken);

    const { uid, email } = decodedToken;
    const { firstname, lastname } = req.body;

    if (!firstname || !lastname) {
      console.log('Firstname or lastname missing');
      return res.status(400).json({ message: 'Firstname and lastname are required' });
    }

    const usersRef = db.collection('users');

    // Check if user exists
    const existingUser = await usersRef.doc(uid).get();
    if (existingUser.exists) {
      console.log(`User with UID ${uid} already registered`);
      return res.status(409).json({ message: 'User already registered' });
    }

    // Fetch default role ('user')
    const defaultRole = await getRoleByNameWithPermissions('user');
    console.log('Default role:', defaultRole);
    if (!defaultRole) {
      console.log('Default role "user" not found');
      return res.status(500).json({ message: 'Default role "user" not found' });
    }

    // Create user document
    const newUser = {
      firstname,
      lastname,
      email,
      roleId: defaultRole.id,
      firebaseUid: uid,
      createdAt: Date.now(),
    };

    console.log('Saving new user:', newUser);

    // Save user using uid as doc ID
    await usersRef.doc(uid).set(newUser);
    console.log('Test document written successfully');

    // Create backend JWT
    const token = jwt.sign(
      { id: uid, email, role: defaultRole.name, permissions: defaultRole.permissions },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({ success: true, user: { ...newUser, id: uid, token } });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// LOGIN USER (via Firebase token)
export const loginUser = async (req, res) => {
  try {
    console.log('Starting user login');

    const idToken = req.headers.authorization?.split(' ')[1];
    if (!idToken) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    console.log('Decoded token:', decodedToken);

    const { uid } = decodedToken;

    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      console.log(`User with UID ${uid} not found in Firestore`);
      return res.status(401).json({ message: 'User not found in Firestore' });
    }

    const userData = userSnap.data();

    if (!userData.roleId) {
      console.log('User role not assigned');
      return res.status(500).json({ message: 'User role not assigned' });
    }

    const roleDoc = await db.collection('roles').doc(userData.roleId).get();
    if (!roleDoc.exists) {
      console.log('Role document missing');
      return res.status(500).json({ message: 'Role document missing' });
    }
    const roleData = roleDoc.data();

    // Get permissions names
    const permissions = [];
    if (Array.isArray(roleData.permissions)) {
      for (const permRef of roleData.permissions) {
        const permSnap = await permRef.get();
        if (permSnap.exists) permissions.push(permSnap.data().name);
      }
    }

    console.log('User role and permissions:', roleData.name, permissions);

    const token = jwt.sign(
      { id: uid, role: roleData.name, permissions },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        token,
        user: {
          _id: uid,
          email: userData.email,
          role: roleData.name,
          permissions,
        },
      });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// ASSIGN ROLE TO USER
export const assignRole = async (req, res) => {
  try {
    console.log('Assigning role to user:', req.params.id);

    const { roleName } = req.body;
    const userId = req.params.id;

    if (!roleName) {
      console.log('roleName is required');
      return res.status(400).json({ message: 'roleName is required' });
    }

    const role = await getRoleByNameWithPermissions(roleName);
    if (!role) {
      console.log(`Role ${roleName} not found`);
      return res.status(404).json({ message: 'Role not found' });
    }

    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      console.log(`User ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    await userRef.update({ roleId: role.id });
    console.log(`Role ${roleName} assigned to user ${userId}`);

    const updatedUserSnap = await userRef.get();
    const updatedUser = updatedUserSnap.data();

    res.json({ message: 'Role assigned successfully', user: { id: userId, ...updatedUser } });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ message: 'Error assigning role', error: error.message });
  }
};

// GET ALL USERS (without passwords)
export const getAllUsers = async (_req, res) => {
  try {
    console.log('Fetching all users');

    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.password; // just in case password field exists
      return { id: doc.id, ...data };
    });

    console.log(`Fetched ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    console.log('Updating user:', req.params.id);

    const { firstname, lastname, email: rawEmail, password } = req.body;

    if (!firstname || !lastname || !rawEmail) {
      console.log('Required fields missing');
      return res.status(400).json({ message: 'firstname, lastname, and email are required' });
    }

    const email = rawEmail.toLowerCase();
    const userRef = db.collection('users').doc(req.params.id);

    const updateData = { firstname, lastname, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
      console.log('Password updated');
    }

    await userRef.update(updateData);
    console.log('User updated in Firestore');

    const updatedUserSnap = await userRef.get();
    const updatedUser = updatedUserSnap.data();

    res.json({ message: 'User updated successfully', user: { id: req.params.id, ...updatedUser } });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// ADMIN TEST ROUTE
export const adminDashboard = (_req, res) => {
  console.log('Admin dashboard accessed');
  res.json({ message: 'Welcome to Admin Dashboard!' });
};
