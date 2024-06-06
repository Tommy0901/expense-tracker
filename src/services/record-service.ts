import dayjs from 'dayjs'
import type mongoose from 'mongoose'
import { type Types } from 'mongoose'

import { Record } from '../models'
import { redisClient } from '../config'

interface Records {
  _id: string | Types.ObjectId
  item: string
  date: 'YYYY-MM-DD'
  amount: number
  class: '收入' | '支出'
  userId: string | Types.ObjectId
  categoryId: {
    _id: string | Types.ObjectId
    type: string
    icon: string
    __v: number
  }
}

interface InsertNewRecord {
  item: string
  date: Date
  amount: string
  class: '收入' | '支出'
  userId: string | Types.ObjectId
  categoryId: Types.ObjectId
}

interface RecordDocument extends mongoose.Document {
  _id: Types.ObjectId
  item: string
  date: Date
  amount: number
  class: string
  userId: Types.ObjectId
  categoryId: Types.ObjectId
  __v: number
}

interface UpdateProperties {
  item: string
  date: Date
  amount: number
  class: '收入' | '支出'
  categoryId: Types.ObjectId
}

const DEFAULT_EXPIRATION = 3600

class RecordService {
  async findRecords (userId: Records['userId']): Promise<Records[]> {
    const redisData = await redisClient.get(`records:${String(userId)}`)

    const records: Records[] = redisData != null
      ? JSON.parse(redisData)
      : (await Record.find({ userId }).populate('categoryId').lean())
          .map(record => ({
            ...record, date: dayjs(record.date).format('YYYY-MM-DD')
          }))

    if (redisData == null) {
      void redisClient
        .setEx(`records:${String(userId)}`, DEFAULT_EXPIRATION, JSON.stringify(records))
    }

    return records
  }

  async findRecordById (recordId: Records['_id']): Promise<RecordDocument | null> {
    return await Record.findById(recordId)
  }

  async findRecordByIdAndDelete (recordId: Records['_id']): Promise<void> {
    await Record.findByIdAndDelete(recordId)
  }

  async createRecord (record: InsertNewRecord): Promise<void> {
    await Record.create(record)
  }

  async updateRecord (record: RecordDocument, update: UpdateProperties): Promise<void> {
    record.item = update.item
    record.date = update.date
    record.amount = update.amount
    record.class = update.class
    record.categoryId = update.categoryId

    await record.save()
  }

  async refreshRecords (userId: Records['userId']): Promise<void> {
    const records = (await Record.find({ userId }).populate('categoryId').lean())
      .map(record => ({
        ...record, date: dayjs(record.date).format('YYYY-MM-DD')
      }))

    void redisClient
      .setEx(`records:${String(userId)}`, DEFAULT_EXPIRATION, JSON.stringify(records))
  }
}

export default RecordService
