const express = require('express');
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { registerValidation, loginValidation } = require('../utils/validators');
const { authLimiter } = require('../middleware/rateLimiter');
const ENDPOINTS = require('../constants/apiEndpoints');

const router = express.Router();

router.post(ENDPOINTS.AUTH.REGISTER, authLimiter, registerValidation, validate, register);
router.post(ENDPOINTS.AUTH.LOGIN, authLimiter, loginValidation, validate, login);
router.post(ENDPOINTS.AUTH.LOGOUT, logout);
router.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, authLimiter, forgotPassword);

router.get(ENDPOINTS.AUTH.PROFILE, protect, getProfile);
router.put(ENDPOINTS.AUTH.PROFILE, protect, updateProfile);

module.exports = router;
