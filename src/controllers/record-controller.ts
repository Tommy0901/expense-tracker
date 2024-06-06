import { type Request, type Response, type NextFunction } from 'express'
import { type Types } from 'mongoose'

import { allNotNullOrEmpty, idCheck } from '../helpers/validation-helper'

import RecordService from '../services/record-service'
import CategoryService from '../services/category-service'

interface AuthenticatedRequest extends Request {
  user: {
    _id: string | Types.ObjectId
    name: string
    email: string
    createAt: string | Date
    __v: number
  }
}

interface RequestBody {
  classType: '收入' | '支出'
  item: string
  date: string
  type: string
  amount: string
}

const DEFAULT_INCOME = 6000

class RecordController {
  private readonly recordService = new RecordService()
  private readonly categoryService = new CategoryService()

  getRecords (req: Request, res: Response, next: NextFunction): void {
    const { _id: userId } = (req as AuthenticatedRequest).user

    void (async () => {
      try {
        const records = await this.recordService.findRecords(userId)

        const initialIncome = (req.user as { earning?: number }).earning ?? DEFAULT_INCOME

        const income = records.reduce((subtotal, record) => {
          return record.class === '收入' ? subtotal + record.amount : subtotal
        }, initialIncome)

        const totalExpenses = records.reduce((subtotal, record) => {
          return record.class === '支出' ? subtotal + record.amount : subtotal
        }, 0)

        const balance = income - totalExpenses

        res.render('index', { income, totalExpenses, balance, records })
      } catch (err) {
        next(err)
      }
    })()
  }

  addRecord (req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'GET') { res.render('new'); return }

    const { _id: userId } = (req as AuthenticatedRequest).user

    const { classType, item, date, type, amount } = req.body as RequestBody

    if (allNotNullOrEmpty(classType, item, date, type, amount)) {
      res.send('Please input class, item name, date, type and amount!'); return
    }

    void (async () => {
      try {
        const categoryId = await this.categoryService.getCategoryId(type)

        if (categoryId == null) { res.send('Please select correct category type.'); return }

        const newRecord = {
          item,
          date: new Date(date),
          amount,
          class: classType,
          userId,
          categoryId
        }

        await this.recordService.createRecord(newRecord)
        await this.recordService.refreshRecords(userId)

        res.redirect('/')
      } catch (err) {
        next(err)
      }
    })()
  }

  editRecord (req: Request, res: Response, next: NextFunction): void {
    const { user: { _id: userId }, params: { id } } = req as AuthenticatedRequest

    if (idCheck(id)) { res.send('Invalid id parameter.'); return }

    if (req.method === 'GET') {
      void (async () => {
        try {
          const records = await this.recordService.findRecords(userId)
          const record = records.find((record) => record._id === id)

          if (record == null) {
            res.send('Insufficient permissions to access.'); return
          }

          const { item, date, amount, class: classType, categoryId: { type } } = record

          res.render('edit', { id, item, date, amount, classType, type })
        } catch (err) {
          next(err)
        }
      })(); return
    }

    const { classType, item, date, type, amount } = req.body as RequestBody

    if (allNotNullOrEmpty(classType, item, date, type, amount)) {
      res.send('Please input class, item name, date, type and amount!'); return
    }

    void (async () => {
      try {
        const categoryId = await this.categoryService.getCategoryId(type)

        if (categoryId == null) { res.send('Please select correct category type.'); return }

        const record = await this.recordService.findRecordById(id)

        if (record == null) {
          res.send("Can't find the record."); return
        }

        if (String(record.userId) !== String(userId)) {
          res.send('Insufficient permissions to edit.'); return
        }

        const update = {
          item,
          date: new Date(date),
          amount: Number(amount),
          class: classType,
          categoryId
        }

        await this.recordService.updateRecord(record, update)
        await this.recordService.refreshRecords(userId)

        res.redirect('/')
      } catch (err) {
        next(err)
      }
    })()
  }

  removeRecord (req: Request, res: Response, next: NextFunction): void {
    const { user: { _id: userId }, params: { id } } = req as AuthenticatedRequest

    if (idCheck(id)) { res.send('Invalid id parameter.'); return }

    void (async () => {
      try {
        const record = await this.recordService.findRecordById(id)

        if (record == null) {
          res.send("Record doesn't exist."); return
        }

        if (String(record.userId) !== String(userId)) {
          res.send('Insufficient permissions to delete.'); return
        }

        await this.recordService.findRecordByIdAndDelete(id)
        await this.recordService.refreshRecords(userId)

        res.redirect('/')
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default RecordController
