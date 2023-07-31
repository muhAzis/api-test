import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { response } from './response.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authToken = req.header('Authorization')?.split(' ')[1] || '';

    jwt.verify(authToken, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
      if (err) {
        return response(401, {}, 'token expired or not match', res);
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return response(401, {}, error.message, res);
  }
};
