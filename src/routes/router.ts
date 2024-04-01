import type Route from './route'
import RecordRoute from './record'
import UserRoute from './user'

export const router: Route[] = [
  new RecordRoute(),
  new UserRoute()
]
