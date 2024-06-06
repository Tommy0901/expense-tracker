import { type Types } from 'mongoose'

import { Category } from '../models'

class CategoryService {
  async getCategoryId (type: string): Promise<Types.ObjectId | undefined> {
    return (await Category.findOne({ type }, '_id').lean())?._id
  }
}

export default CategoryService
