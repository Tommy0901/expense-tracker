import { type Request, type Response } from 'express'

const records = [
  {
    id: 1,
    category: 'fa-house',
    name: '住宿',
    date: '2024-12-10',
    expense: 1500
  },
  {
    id: 2,
    category: 'fa-van-shuttle',
    name: '交通',
    date: '2024-12-10',
    expense: 600
  },
  {
    id: 3,
    category: 'fa-face-laugh-beam',
    name: '娛樂',
    date: '2024-12-10',
    expense: 600
  }
]

const total = records.reduce((subtotal, i) => subtotal + i.expense, 0)

class RecordController {
  getRecords (req: Request, res: Response): void {
    res.render('index', { total, records })
  }

  addRecord (req: Request, res: Response): void {
    res.render('new')
  }

  editRecord (req: Request, res: Response): void {
    const { id } = req.params
    res.render('edit', { id })
  }
}

export default RecordController
