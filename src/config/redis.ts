import * as redis from 'redis'

const redisClient = redis.createClient()

void (async () => {
  await redisClient.connect()
  await redisClient.ping()
  console.log('Redis server is ready')
})().catch(err => { throw err })

export default redisClient
