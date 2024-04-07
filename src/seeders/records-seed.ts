import { User, Record, Category } from '../models'
import records from './intial/records.json'

interface RecordWithIds {
  type: string
  item: string
  date: string | Date
  amount: number
  class: string
  userId: string | object
  categoryId: string | object | undefined
}

export async function initializeRecords (): Promise<void> {
  try {
    const [users, categories] = await Promise.all([User.find(), Category.find()])

    const categoryMap = new Map(categories.map(i => [i.type, i._id]))

    const recordsWithIds: RecordWithIds[] = []

    users.forEach(user => {
      records.forEach(record => {
        recordsWithIds.push({
          ...record,
          userId: user._id,
          categoryId: categoryMap.get(record.type)
        })
      })
    })
    console.log('initializeRecords:\n', await Record.insertMany(recordsWithIds))
  } catch (err) {
    console.error(err)
  }
}
