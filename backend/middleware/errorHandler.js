import { sendError } from '../utils/httpError.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  console.error(err);
  sendError(res, err);
}
