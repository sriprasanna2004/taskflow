const CryptoJS = require('crypto-js');

/**
 * Encrypt a string value using AES-256
 * SECRET is read lazily so .env is always loaded first
 */
const encrypt = (value) => {
  if (!value) return value;
  const secret = process.env.AES_SECRET_KEY;
  if (!secret) throw new Error('AES_SECRET_KEY is not set');
  return CryptoJS.AES.encrypt(String(value), secret).toString();
};

/**
 * Decrypt an AES-encrypted string
 */
const decrypt = (cipherText) => {
  if (!cipherText) return cipherText;
  const secret = process.env.AES_SECRET_KEY;
  if (!secret) throw new Error('AES_SECRET_KEY is not set');
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
