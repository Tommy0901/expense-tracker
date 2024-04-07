import passport from 'passport'
import { type Types } from 'mongoose'

import { User } from '../models'

passport.serializeUser((user, done) => {
  const { _id: id } = user as { _id: Types.ObjectId }
  done(null, id) // id 將作為 passport.deserializeUser 搜尋使用者資料的索引值
})

passport.deserializeUser((id, done) => {
  void (async () => {
    try {
      done(null, await User.findById(id).select('-password -createAt -__v').lean())
    } catch (err) {
      done(err)
    }
  })()
})

export default passport
