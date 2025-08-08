// middlewares/validators/authValidator.js

import { body } from 'express-validator';

export const registerValidator = [
  body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body("phoneNumber").isMobilePhone().withMessage('Valid phone number is required'),
  body('referralCode').optional().isString().trim(),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
 
];

export const adminLoginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('secretKey').notEmpty().withMessage('Secret key is required'),
  
];


export const updateProfileValidator = [
  body('name').optional().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phoneNumber').optional().isMobilePhone().withMessage('Valid phone number is required'),
 
];

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
 
];

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
 
];
export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
 
];


export const verifyEmailValidator = [
  body('token').notEmpty().withMessage('Verification token is required'),
 
];


