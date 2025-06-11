import { admin, db } from '../firebaseAdmin.js';
import { doc, getDoc } from 'firebase/firestore';

// Middleware: Verify Firebase ID token and load user + role data from Firestore
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Try to get token from cookie or Authorization header (Bearer token)
    const idToken = req.cookies.token || req.header("Authorization")?.split(" ")[1];
    if (!idToken) return res.status(401).json({ message: "No token provided" });

    // Verify token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Fetch user document from Firestore
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userSnap.data();

    // Fetch role document if roleId is present
    let roleData = null;
if (userData.roleId) {
  const roleRef = doc(db, 'roles', userData.roleId);
  const roleSnap = await getDoc(roleRef);
  if (roleSnap.exists()) {
    roleData = roleSnap.data();
  }
}
// Assign default role if roleData missing
if (!roleData) {
  const defaultRoleRef = doc(db, 'roles', 'user');
  const defaultRoleSnap = await getDoc(defaultRoleRef);
  roleData = defaultRoleSnap.exists() ? defaultRoleSnap.data() : null;
}

    // Attach user info to request object for downstream middleware/controllers
    req.user = {
      id: userId,
      email: userData.email,
      firstname: userData.firstname,
      lastname: userData.lastname,
      role: roleData ? { id: userData.roleId, ...roleData } : null,
    };

    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired Firebase token" });
  }
};

// Middleware: Check if user role is in allowed roles list
export const verifyRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.name;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied: insufficient role permissions" });
    }
    next();
  };
};
