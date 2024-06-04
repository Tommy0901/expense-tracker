import { type Request, type Response, type NextFunction } from 'express'
import mongoose, { type Types } from 'mongoose'
import dayjs from 'dayjs'

import { Category, Record } from '../models'
import { redisClient } from '../config'
import { allNotNullOrEmpty, idCheck } from '../helpers/validation-helper'

const DEFAULT_EARNING = 6000
const DEFAULT_EXPIRATION = 3600

class RecordController {
  getRecords (req: Request, res: Response, next: NextFunction): void {
    const userId = (req.user as { _id: string | Types.ObjectId })._id

    void (async () => {
      try {
        const redisData = await redisClient.get(`records:${String(userId)}`)

        const records = redisData != null
          ? JSON.parse(redisData)
          : (await Record.find({ userId }).populate('categoryId').lean())
              .map(record => ({
                ...record, date: dayjs(record.date).format('YYYY-MM-DD')
              }))

        if (redisData == null) {
          void redisClient
            .setEx(`records:${String(userId)}`, DEFAULT_EXPIRATION, JSON.stringify(records))
        }

        const income = records.reduce((subtotal: number, record: { amount: number, class: string }) => {
          return record.class === '收入' ? subtotal + record.amount : subtotal
        }, (req.user as { earning?: number }).earning ?? DEFAULT_EARNING)

        const totalExpenses = records.reduce((subtotal: number, record: { amount: number, class: string }) => {
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

    const { _id: userId } = req.user as { _id: string | Types.ObjectId }

    const { classType, item, date, type, amount } = req.body as RequestBody

    interface RequestBody {
      classType: string
      item: string
      date: string
      type: string
      amount: string
    }

    if (allNotNullOrEmpty(classType, item, date, type, amount)) {
      res.send('Please input class, item name, date, type and amount!'); return
    }

    void (async () => {
      try {
        const categoryMap = new Map((await Category.find().lean()).map(i => [i.type, i._id]))

        await Record.create({
          item,
          date: new Date(date),
          amount,
          class: classType,
          userId,
          categoryId: categoryMap.get(type)
        })

        const records = (await Record.find({ userId }).populate('categoryId').lean())
          .map(record => ({
            ...record, date: dayjs(record.date).format('YYYY-MM-DD')
          }))

        void redisClient
          .setEx(`records:${String(userId)}`, DEFAULT_EXPIRATION, JSON.stringify(records))

        res.redirect('/')
      } catch (err) {
        next(err)
      }
    })()
  }

  editRecord (req: Request, res: Response, next: NextFunction): void {
    const userId = (req.user as { _id: string | Types.ObjectId })._id
    const id = req.params.id

    if (idCheck(id)) { res.send('Invalid id parameter.'); return }

    if (req.method === 'GET') {
      void (async () => {
        try {
          const redisData = await redisClient.get(`records:${String(userId)}`)

          const records = redisData != null
            ? JSON.parse(redisData)
            : (await Record.find({ userId }).populate('categoryId').lean())
                .map(record => ({
                  ...record, date: dayjs(record.date).format('YYYY-MM-DD')
                }))

          if (redisData == null) {
            void redisClient
              .setEx(`records:${String(userId)}`, DEFAULT_EXPIRATION, JSON.stringify(records))
          }
          const record = records.find((record: { _id: string }) => record._id === id)

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

    interface RequestBody {
      classType: string
      item: string
      date: string
      type: string
      amount: string
    }

    if (allNotNullOrEmpty(classType, item, date, type, amount)) {
      res.send('Please input class, item name, date, type and amount!'); return
    }

    void (async () => {
      try {
        const categoryMap = new Map((await Category.find().lean()).map(i => [i.type, i._id]))

        const record = await Record.findById(id)

        if (record == null) {
          res.send("Can't find the record."); return
        }

        if (String(record.userId) !== String(userId)) {
          res.send('Insufficient permissions to edit.'); return
        }

        record.item = item
        record.date = new Date(date)
        record.amount = Number(amount)
        record.class = classType
        record.userId = new mongoose.Types.ObjectId(userId)
        record.categoryId = new mongoose.Types.ObjectId(categoryMap.get(type))

        await record.save()

        const records = (await Record.find({ userId }).populate('categoryId').lean())
          .map(record => ({
            ...record, date: dayjs(record.date).format('YYYY-MM-DD')
          }))

        void redisClient
          .setEx(`records:${String(userId)}`, DEFAULT_EXPIRATION, JSON.stringify(records))

        res.redirect('/')
      } catch (err) {
        next(err)
      }
    })()
  }

  removeRecord (req: Request, res: Response, next: NextFunction): void {
    const userId = (req.user as { _id: Types.ObjectId })._id
    const id = req.params.id

    if (idCheck(id)) { res.send('Invalid id parameter.'); return }

    void (async () => {
      try {
        const record = await Record.findById(id)

        if (record == null) {
          res.send("Record doesn't exist."); return
        }

        if (String(record.userId) !== String(userId)) {
          res.send('Insufficient permissions to delete.'); return
        }

        await record.deleteOne({ _id: id, userId })

        const records = (await Record.find({ userId }).populate('categoryId').lean())
          .map(record => ({
            ...record, date: dayjs(record.date).format('YYYY-MM-DD')
          }))

        void redisClient
          .setEx(`records:${String(userId)}`, DEFAULT_EXPIRATION, JSON.stringify(records))

        res.redirect('/')
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default RecordController
