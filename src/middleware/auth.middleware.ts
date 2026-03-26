import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/sendResponse';

interface JwtPayload {
  _id: string;
  role: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
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

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    sendResponse(res, 403, { error: 'Access denied. Admin privileges required.' });
    return;
  }
  next();
};
