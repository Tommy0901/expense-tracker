import UserController from '../controllers/user-controller'
import Route from './route'

class UserRoute extends Route {
  private readonly userController = new UserController()

  constructor () {
    super()
    this.setRoutes()
  }

  protected setRoutes (): void {
    this.router.post('/login',
      this.userController.signIn.bind(this.userController)
    )
    this.router.get('/login',
      this.userController.signIn.bind(this.userController)
    )
    this.router.get('/logout',
      this.userController.signOut.bind(this.userController)
    )
    this.router.post('/register',
      this.userController.signUp.bind(this.userController)
    )
    this.router.get('/register',
      this.userController.signUp.bind(this.userController)
    )
  }
}

export default UserRoute
