import User from '../models/user'
import users from './intial/users.json'

export async function initializeUsers (): Promise<void> {
  try {
    console.log('initializeUseres:\n', await User.insertMany(users))
  } catch (err) {
    console.error(err)
  }
}
