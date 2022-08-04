import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import teacherRoutes from './routes/teacher.routes'

import { errorHandler, logStream, config } from './common'

const app = express()

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    if (config.CORS_SAME_ORIGIN === 'false') {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))
app.use(express.json({ limit: '20mb' }))

// By adding this route before morgan prevents it being logged which in production setting
// is annoying and pollutes the logs with gazillion "GET /health" lines
app.get('/health', (req: any, res: any) => { res.sendStatus(200) })

app.use(morgan('short', { stream: logStream }))

app.use('/api', teacherRoutes)
app.use(errorHandler)

export { app }
