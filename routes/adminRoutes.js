import express from 'express';
import {
  createPermission,
  getAllPermissions,
  updatePermission,
  deletePermission,
} from '../controllers/admin/permissionController.js';
import { verifyFirebaseToken as verifyToken, verifyRole } from '../middleware/verifyFirebaseToken.js';


const router = express.Router();

// All these routes require the 'admin' role
router.post('/permissions', verifyToken, verifyRole(['admin']), createPermission);
router.get('/permissions', verifyToken, verifyRole(['admin']), getAllPermissions);
router.put('/permissions/:id', verifyToken, verifyRole(['admin']), updatePermission);
router.delete('/permissions/:id', verifyToken, verifyRole(['admin']), deletePermission);

export default router;
