import { Response, NextFunction } from 'express';
import { ExpressRequest } from '../types/types';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/sendResponse';
import { Role } from '../constants/roles';

interface JwtPayload {
  _id: string;
  role: string;
}

/**
 * authenticate(role?)
 *
 * Verifies the Bearer token and, if a role is provided, checks that the
 * token's role matches before calling next(). Returns 401 for missing/invalid
 * tokens and 403 for role mismatches.
 *
 * @example
 * router.use(authenticate(ROLES.ADMIN))   // token required + must be admin
 * router.use(authenticate(ROLES.STUDENT)) // token required + must be student
 * router.use(authenticate())              // token required, any role accepted
 */
export const authenticate = (role?: Role) => {
  return (req: ExpressRequest, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendError(res, 401, 'You are not logged in. Please log in to continue.');
        return;
      }

      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        sendError(res, 500, 'Server configuration error. Please contact support.');
        return;
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;

      if (role && decoded.role !== role) {
        sendError(res, 403, 'You do not have permission to access this page.');
        return;
      }

      req.user = {
        _id: decoded._id,
        role: decoded.role,
      };

      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        sendError(res, 401, 'Your session has expired. Please log in again.');
      } else if (err instanceof jwt.JsonWebTokenError) {
        sendError(res, 401, 'Invalid session. Please log in again.');
      } else {
        sendError(res, 401, 'Authentication failed. Please log in again.');
      }
    }
  };
};
