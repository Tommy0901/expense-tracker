import express from 'express'
import path from 'path'

import { router } from './routes/router'
import timeHelpers from './helpers/time-helpers'

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
