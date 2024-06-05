import { type Request, type Response, type NextFunction } from 'express'
import bcrypt from 'bcryptjs'

import { User } from '../models'

import { setCookies } from '../middlewares/cookie-handler'
import { allNotNullOrEmpty } from '../helpers/validation-helper'

interface RequestBody {
  name: string
  email: string
  password: string
  confirmPassword: string
  rememberMe?: string
}

type MySpending = '' | { email: string, remember: 'on' }

class UserController {
  signUp (req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'GET') { res.render('register'); return }

    const { name, email, password, confirmPassword } = req.body as RequestBody

    if (allNotNullOrEmpty(name, email, password)) {
      res.send('Please enter name, email and password!'); return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.send('The email format is invalid.'); return
    }

    if (password !== confirmPassword) {
      res.send('Passwords do not match!'); return
    }

    void (async () => {
      try {
        const user = await User.findOne({ email })
        if (user != null) { res.send('Email already exists!'); return }

        await User.create({
          name,
          email,
          password: await bcrypt.hash(String(password), 10)
        })

        res.render('login')
      } catch (err) {
        next(err)
      }
    })()
  }

  signIn (req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'GET') {
      res.render('login', { ...req.cookies?.mySpending as MySpending }); return
    }

    const { email, password, rememberMe } = req.body as RequestBody

    void (async () => {
      try {
        const user = await User.findOne({ email }).lean()
        if (user == null) {
          res.send('Incorrect username or password.'); return
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
          res.send('Incorrect username or password.'); return
        }

        setCookies(req, res, user.email, rememberMe)

        req.logIn(user, err => {
          err != null ? next(err) : res.redirect('/')
        })
      } catch (err) {
        next(err)
      }
    })()
  }

  signOut (req: Request, res: Response, next: NextFunction): void {
    req.logout(err => {
      err != null ? next(err) : res.redirect('/login')
    })
  }
}

export default UserController
