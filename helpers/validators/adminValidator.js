// import { body } from 'express-validator';

// export const createPermissionValidator = [
//   body('name')
//     .notEmpty().withMessage('Permission name is required')
//     .isString().withMessage('Permission name must be a string')
//     .trim()
//     .toLowerCase()
// ];

// export const createRoleValidator = [
//   body('name')
//     .notEmpty().withMessage('Role name is required')
//     .isString().withMessage('Role name must be a string')
//     .trim()
//     .toLowerCase(),
//   body('permissions')
//     .optional()
//     .isArray().withMessage('Permissions must be an array of IDs')
// ];

import { body } from 'express-validator';

export const createPermissionValidator = [
  body('name')
    .notEmpty().withMessage('Permission name is required')
    .isString().withMessage('Permission name must be a string')
    .trim()
    .toLowerCase(),
];

export const createRoleValidator = [
  body('name')
    .notEmpty().withMessage('Role name is required')
    .isString().withMessage('Role name must be a string')
    .trim()
    .toLowerCase(),

  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array')
    .bail()
    .custom((permissions) => {
      if (!permissions.every(p => typeof p === 'string' && p.trim() !== '')) {
        throw new Error('Each permission must be a non-empty string (Firestore ID or name)');
      }
      return true;
    }),
];
