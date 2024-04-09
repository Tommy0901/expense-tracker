import RecordController from '../controllers/record-controller'
import Route from './route'

import { authenticated } from '../middlewares/auth-handler'

class RecordRoute extends Route {
  private readonly recordController = new RecordController()

  constructor () {
    super()
    this.setRoutes()
  }

  protected setRoutes (): void {
    this.router.put('/edit/:id', authenticated,
      this.recordController.editRecord.bind(this.recordController)
    )
    this.router.get('/edit/:id', authenticated,
      this.recordController.editRecord.bind(this.recordController)
    )
    this.router.post('/new', authenticated,
      this.recordController.addRecord.bind(this.recordController)
    )
    this.router.get('/new', authenticated,
      this.recordController.addRecord.bind(this.recordController)
    )
    this.router.delete('/remove/:id', authenticated,
      this.recordController.removeRecord.bind(this.recordController)
    )
    this.router.get('/', authenticated,
      this.recordController.getRecords.bind(this.recordController)
    )
  }
}

export default RecordRoute
