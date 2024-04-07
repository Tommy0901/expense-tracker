import { type Request, type Response, type NextFunction } from 'express'

export function authenticated (req: Request, res: Response, next: NextFunction): void {
  req.isAuthenticated() ? next() : res.redirect('/login')
}
