const { registerUser, loginUser } = require('../services/authService');
const { sendTokenCookie } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    sendTokenCookie(res, user._id);
    return successResponse(res, 201, 'Registration successful.', {
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);
    sendTokenCookie(res, user._id);
    return successResponse(res, 200, 'Login successful.', {
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return successResponse(res, 200, 'Logged out successfully.');
};

/**
 * GET /api/auth/me  — returns current authenticated user
 */
const getMe = (req, res) => {
  return successResponse(res, 200, 'Authenticated user.', {
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};

module.exports = { register, login, logout, getMe };
