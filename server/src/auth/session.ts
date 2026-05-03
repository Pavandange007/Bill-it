import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import { env } from '../env'

export interface SessionPayload {
  sub: string
  email: string
}

const COOKIE_NAME = 'session'

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' })
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
  })
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export function readSessionToken(req: Request): string | null {
  const token = (req.cookies?.[COOKIE_NAME] as string | undefined) ?? null
  return token
}

export function verifySessionToken(token: string): SessionPayload {
  return jwt.verify(token, env.JWT_SECRET) as SessionPayload
}

