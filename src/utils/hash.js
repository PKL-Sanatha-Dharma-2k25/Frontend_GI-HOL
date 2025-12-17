
import CryptoJS from 'crypto-js';

export const hashPassword = (password) => {
  return CryptoJS.MD5(password).toString();
};

