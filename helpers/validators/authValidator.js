// import { body } from 'express-validator';

// export const registerValidation = [
//     body('firstname').notEmpty().withMessage('First name is required'),
//     body('lastname').notEmpty().withMessage('Last name is required'),
//     body('email').isEmail().withMessage('Enter a valid email'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
// ];

// export const loginValidation = [
//     body('email').isEmail().withMessage('Enter a valid email'),
//     body('password').notEmpty().withMessage('Password is required')
// ];

// export const roleAssignmentValidation = [
//     body('roleId').notEmpty().withMessage('Role ID is required')
// ];

import { body } from 'express-validator';

export const registerValidation = [
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/)
        .withMessage('Password must include both letters and numbers')
];

export const loginValidation = [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

export const roleAssignmentValidation = [
    body('roleId').notEmpty().withMessage('Role ID is required')
];
