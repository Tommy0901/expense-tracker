import * as redis from 'redis'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') dotenv.config()
if (process.env.REDIS_URL == null) throw new Error('REDIS_URL is not defined.')

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
})

void (async () => {
  await redisClient.connect()
  await redisClient.ping()
  console.log('Redis server is ready')
})().catch(err => { throw err })

export default redisClient
