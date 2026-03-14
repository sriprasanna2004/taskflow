const jwt = require('jsonwebtoken');

/**
 * Sign a JWT token for a given user id
 */
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Attach JWT as an HTTP-only cookie and return token
 */
const sendTokenCookie = (res, userId) => {
  const token = signToken(userId);

  const cookieOptions = {
    httpOnly: true,                          // not accessible via JS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,        // 7 days in ms
  };

  res.cookie('token', token, cookieOptions);
  return token;
};

module.exports = { signToken, sendTokenCookie };
