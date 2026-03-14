const User = require('../models/User');

/**
 * Register a new user
 */
const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered.');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password });
  return user;
};

/**
 * Validate credentials and return user
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  return user;
};

module.exports = { registerUser, loginUser };
