import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/httpError.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new HttpError(401, 'Token de acceso requerido'));
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return next(new HttpError(500, 'JWT_SECRET environment variable is not configured'));
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return next(new HttpError(401, 'Token inválido o expirado'));
    }
    req.user = user;
    next();
  });
}
