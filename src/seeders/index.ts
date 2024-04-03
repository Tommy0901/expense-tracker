import dotenv from 'dotenv'

import { connectToMongoDB, disconnectFromMongoDB } from '../config/mongoose'
import { initializeCategories } from './categories-seed'
import { initializeUsers } from './users-seed'
import { initializeRecords } from './records-seed'

void (async () => {
  if (process.env.NODE_ENV !== 'production') dotenv.config()
  if (process.env.MONGODB_URI == null) throw new Error('MONGODB_URI is not defined.')
  try {
    connectToMongoDB(process.env.MONGODB_URI)
    await initializeCategories()
    await initializeUsers()
    await initializeRecords()
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
  } finally {
    disconnectFromMongoDB()
  }
})()
