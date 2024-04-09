import { type Request, type Response } from 'express'

export function setCookies (req: Request, res: Response, email: string, rememberMe: string | undefined, days: number = 90): void {
  const cookieOptions = {
    maxAge: days * 24 * 60 * 60 * 1000, // 90 天的毫秒數
    path: '/login', // 只在 /login 路由中可用
    httpOnly: true
  }

  const cookieValue = {
    email,
    rememberMe: 'on'
  }

  rememberMe != null
    ? res.cookie('mySpending', cookieValue, cookieOptions)
    : res.clearCookie('mySpending', cookieOptions)
}
