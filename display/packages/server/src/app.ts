import express from 'express'
import indexRouter from '@/routes'
import historyApiFallback from 'connect-history-api-fallback'
import path from 'path'
import logger from '@/middleware/logger'

const app = express()
// do NOT expose the server identity EXPRESS
// avoid any targeted attacks
app.disable('x-powered-by')

// Enable morgan logging
app.use(logger)
app.use(historyApiFallback()) // fallback to html
app.use(express.static(path.join(__dirname, '/public')))
app.use('/_api', indexRouter)

export default app