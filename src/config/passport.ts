import passport from 'passport'
import { type Types } from 'mongoose'

import { User } from '../models'
import { redisClient } from './'

const DEFAULT_EXPIRATION = 3600

passport.serializeUser((user, done) => {
  const { password, ...redisData } = user as { password: string, redisData: object }
  const { _id: id } = user as { _id: Types.ObjectId }

  void redisClient
    .setEx(`id:${String(id)}`, DEFAULT_EXPIRATION, JSON.stringify(redisData))

  done(null, id) // id 將作為 passport.deserializeUser 搜尋使用者資料的索引值
})

passport.deserializeUser((id, done) => {
  void (async () => {
    try {
      const redisData = await redisClient.get(`id:${String(id)}`)

      if (redisData != null) {
        const user = JSON.parse(redisData) as { _id: string, name: string, email: string, createAt: string, __v: number }
        done(null, user); return
      }
      const user = await User.findById(id).select('-password').lean()

      void redisClient
        .setEx(`id:${String(user?._id)}`, DEFAULT_EXPIRATION, JSON.stringify(user))

      done(null, user)
    } catch (err) {
      done(err)
    }
  })()
})

export default passport
