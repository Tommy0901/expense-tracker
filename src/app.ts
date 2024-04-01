import express from 'express'
import path from 'path'

const app = express()
const port = 3000

const records = [
  {
    category: 'fa-house',
    name: '住宿',
    date: '2024-12-10',
    expense: 1500
  },
  {
    category: 'fa-van-shuttle',
    name: '交通',
    date: '2024-12-10',
    expense: 600
  },
  {
    category: 'fa-face-laugh-beam',
    name: '娛樂',
    date: '2024-12-10',
    expense: 600
  }
]

const total = records.reduce((subtotal, i) => subtotal + i.expense, 0)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  res.render('index', { total, records })
})

app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`)
})
