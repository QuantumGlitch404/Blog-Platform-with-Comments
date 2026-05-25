const { body } = require('express-validator');

exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
    .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),
];

exports.loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.postValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required').isLength({ max: 300 }),
  body('category').notEmpty().withMessage('Category is required'),
];

exports.commentValidation = [
  body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 1000 }),
];
