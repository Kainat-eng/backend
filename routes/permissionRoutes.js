import express from 'express';
import {
  createPermission,
  getAllPermissions,
  updatePermission,
  deletePermission,
} from '../controllers/permissionController.js';
import { verifyFirebaseToken as verifyToken, verifyRole } from '../middleware/verifyFirebaseToken.js';
 // Import the middlewares
import checkPermission from '../middleware/checkPermission.js'; // Import the permission check

const router = express.Router();

// Protect routes with 'verifyToken' middleware and 'verifyRole' for 'admin' role
router.post('/', verifyToken, verifyRole(['admin']), checkPermission('createPermission'), createPermission);
router.get('/', verifyToken, verifyRole(['admin']), checkPermission('viewPermission'), getAllPermissions);
router.put('/:id', verifyToken, verifyRole(['admin']), checkPermission('updatePermission'), updatePermission);
router.delete('/:id', verifyToken, verifyRole(['admin']), checkPermission('deletePermission'), deletePermission);

export default router;
