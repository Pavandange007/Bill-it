import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './env'
import { authRouter } from './auth/authRouter'

const app = express()

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true })
})

app.use('/api/auth', authRouter)

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.PORT}`)
})

