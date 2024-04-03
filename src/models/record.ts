import User from './user'
import Category from './category'

import { model, Schema } from 'mongoose'

const recordSchema = new Schema({
  item: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    index: true,
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: Category,
    index: true,
    required: true
  }
})

export default model('Record', recordSchema)
