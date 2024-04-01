import express from 'express'
import path from 'path'

const app = express()
const port = 3000

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  res.render('index', { greetings: 'How do you do?' })
})

app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`)
})
