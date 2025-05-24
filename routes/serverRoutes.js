// routes/serverRoutes.js

// import express from 'express';
// import {
//   createServer,
//   getAllServers,
//   getServerById,
//   updateServer,
//   deleteServer,
//   trackUptimeDowntime,
//   getSecurityThreats,
// } from '../controllers/serverController.js';
// import { isAuthenticated } from '../middleware/authMiddleware.js';
// import { authorizeRoles } from '../middlewares/rbacMiddleware.js';

// const router = express.Router();

// // Only ServerAdmins can access these routes
// router.use(isAuthenticated, authorizeRoles('ServerAdmin'));

// router.post('/', createServer);
// router.get('/', getAllServers);
// router.get('/:id', getServerById);
// router.put('/:id', updateServer);
// router.delete('/:id', deleteServer);
// router.get('/:id/uptime', trackUptimeDowntime);
// router.get('/:id/security-threats', getSecurityThreats);

// export default router;

import express from 'express';
import {
  createServer,
  getAllServers,
  getServerById,
  updateServer,
  deleteServer,
  trackUptimeDowntime,
  getSecurityThreats,
} from '../controllers/serverController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all server routes — only accessible by ServerAdmins
router.use(verifyToken, verifyRole(['ServerAdmin']));

router.post('/', createServer);
router.get('/', getAllServers);
router.get('/:id', getServerById);
router.put('/:id', updateServer);
router.delete('/:id', deleteServer);
router.get('/:id/uptime', trackUptimeDowntime);
router.get('/:id/security-threats', getSecurityThreats);

export default router;
