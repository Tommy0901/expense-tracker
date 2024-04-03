import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

import timeHelpers from './helpers/time-helpers'
import { router } from './routes/router'
import { connectToMongoDB } from './config/mongoose'

if (process.env.NODE_ENV !== 'production') dotenv.config()
if (process.env.MONGODB_URI == null) throw new Error('MONGODB_URI is not defined.')

connectToMongoDB(process.env.MONGODB_URI)

const app = express()
const port = 3000

app.locals = timeHelpers

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

for (const route of router) {
  app.use(route.getRouter())
}

app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`)
})
