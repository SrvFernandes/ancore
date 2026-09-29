import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createNamespace } from 'cls-hooked'; // Required: npm install cls-hooked @types/cls-hooked uuid @types/uuid

// Augment Express Request type to include requestId
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

// Create a CLS namespace for request-scoped context
export const requestNamespace = createNamespace('ancore-relayer-request');

/**
 * Middleware to generate a unique request ID, attach it to the request object,
 * set the X-Request-ID response header, and make it available in the CLS context.
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  requestNamespace.run(() => {
    const requestId = uuidv4();
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    requestNamespace.set('requestId', requestId);
    next();
  });
};
