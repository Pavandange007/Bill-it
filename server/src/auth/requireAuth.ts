import type { NextFunction, Request, Response } from 'express'
import { readSessionToken, verifySessionToken } from './session'

export interface AuthedRequest extends Request {
  user?: { id: string; email: string }
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = readSessionToken(req)
  if (!token) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  try {
    const payload = verifySessionToken(token)
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    res.status(401).json({ error: 'unauthorized' })
  }
}

