import express from 'express'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import session from 'express-session'
import dotenv from 'dotenv'
import path from 'path'

import timeHelpers from './helpers/time-helpers'
import { router } from './routes/router'
import { passport, connectToMongoDB } from './config'

if (process.env.NODE_ENV !== 'production') dotenv.config()
if (process.env.MONGODB_URI == null) throw new Error('MONGODB_URI is not defined.')
if (process.env.SESSION_SECRET == null) throw new Error('SESSION_SECRET is not defined.')

connectToMongoDB(process.env.MONGODB_URI)

const app = express()
const port = 3000

app.locals = timeHelpers

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

for (const route of router) {
  app.use(route.getRouter())
}

app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`)
})
