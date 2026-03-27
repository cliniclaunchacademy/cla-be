import { Response, NextFunction } from 'express';
import { ExpressRequest } from '../types/types';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/sendResponse';
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
        sendResponse(res, 401, { error: 'No token provided. Authorization denied.' });
        return;
      }

      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        sendResponse(res, 500, { error: 'JWT secret not configured.' });
        return;
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;

      if (role && decoded.role !== role) {
        sendResponse(res, 403, { error: 'Access denied. Insufficient permissions.' });
        return;
      }

      req.user = {
        _id: decoded._id,
        role: decoded.role,
      };

      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        sendResponse(res, 401, { error: 'Token has expired. Please log in again.' });
      } else if (err instanceof jwt.JsonWebTokenError) {
        sendResponse(res, 401, { error: 'Invalid token. Authorization denied.' });
      } else {
        sendResponse(res, 401, { error: 'Authentication failed.' });
      }
    }
  };
};
