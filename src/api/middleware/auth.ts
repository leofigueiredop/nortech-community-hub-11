import { Request, Response, NextFunction } from 'express';
import { User } from '@supabase/supabase-js';
import { api } from '../ApiClient';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const validateAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: { message: 'No authorization header', code: 'AUTH_ERROR' }
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: { message: 'Invalid authorization header format', code: 'AUTH_ERROR' }
      });
    }

    const { data: { user }, error } = await api.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: { message: 'Invalid or expired token', code: 'AUTH_ERROR' }
      });
    }

    // Add user to request for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      error: { message: 'Authentication error', code: 'AUTH_ERROR' }
    });
  }
}; 