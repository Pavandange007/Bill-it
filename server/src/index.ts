import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import type { NextFunction, Request, Response } from 'express'
import { env } from './env'
import { authRouter } from './auth/authRouter'

const app = express()

app.set('trust proxy', 1)

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.status(200).send('ok')
})

app.head('/health', (_req, res) => {
  res.status(200).end()
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true })
})

app.use('/api/auth', authRouter)

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err)
  res.status(500).json({ error: 'internal_server_error' })
})

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.PORT}`)
})

