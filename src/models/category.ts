import { model, Schema } from 'mongoose'

const categorySchema = new Schema({
  type: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})

export default model('Category', categorySchema)
