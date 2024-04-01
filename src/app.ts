import express from 'express'
import path from 'path'

import { router } from './routes/router'

const app = express()
const port = 3000

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

for (const route of router) {
  app.use(route.getRouter())
}

app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`)
})
