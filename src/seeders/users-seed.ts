import bcrypt from 'bcryptjs'

import { User } from '../models'
import users from './intial/users.json'

interface UserData {
  name: string
  email: string
  password: string
}

async function hashPasswords (users: UserData[]): Promise<void> {
  for (const user of users) {
    try {
      user.password = await bcrypt.hash(user.password, 10)
    } catch (err) {
      console.error(err)
    }
  }
}

export async function initializeUsers (): Promise<void> {
  try {
    await hashPasswords(users)
    console.log('initializeUseres:\n', await User.insertMany(users))
  } catch (err) {
    console.error(err)
  }
}
