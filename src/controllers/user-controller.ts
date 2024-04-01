import { type Request, type Response } from 'express'

class UserController {
  signUp (req: Request, res: Response): void {
    res.render('register')
  }

  signIn (req: Request, res: Response): void {
    res.render('login')
  }

  signOut (req: Request, res: Response): void {
    res.send('登出成功')
  }
}

export default UserController
