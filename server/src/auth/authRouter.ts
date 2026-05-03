import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../prisma'
import { loginSchema, signupSchema } from './authSchemas'
import { clearSessionCookie, setSessionCookie, signSession } from './session'
import { requireAuth, type AuthedRequest } from './requireAuth'

export const authRouter = Router()

authRouter.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_request', details: parsed.error.flatten() })
    return
  }

  const email = parsed.data.email.toLowerCase()
  const password = parsed.data.password

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409).json({ error: 'email_in_use' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  })

  const token = signSession({ sub: user.id, email: user.email })
  setSessionCookie(res, token)

  res.status(201).json({ user })
})

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_request', details: parsed.error.flatten() })
    return
  }

  const email = parsed.data.email.toLowerCase()
  const password = parsed.data.password

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(401).json({ error: 'invalid_credentials' })
    return
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    res.status(401).json({ error: 'invalid_credentials' })
    return
  }

  const token = signSession({ sub: user.id, email: user.email })
  setSessionCookie(res, token)
  res.status(200).json({ user: { id: user.id, email: user.email, createdAt: user.createdAt } })
})

authRouter.post('/logout', async (_req, res) => {
  clearSessionCookie(res)
  res.status(204).send()
})

authRouter.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, createdAt: true },
  })

  if (!user) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  res.status(200).json({ user })
})

