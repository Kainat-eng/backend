import express from 'express';
import {
  createPermission,
  getAllPermissions,
  updatePermission,
  deletePermission,
} from '../controllers/admin/permissionController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All these routes require the 'admin' role
router.post('/permissions', verifyToken, verifyRole(['admin']), createPermission);
router.get('/permissions', verifyToken, verifyRole(['admin']), getAllPermissions);
router.put('/permissions/:id', verifyToken, verifyRole(['admin']), updatePermission);
router.delete('/permissions/:id', verifyToken, verifyRole(['admin']), deletePermission);

export default router;
