import { Category } from '../models'
import categories from './intial/categories.json'

export async function initializeCategories (): Promise<void> {
  try {
    console.log('initializeCategories:\n', await Category.insertMany(categories))
  } catch (err) {
    console.error(err)
  }
}
