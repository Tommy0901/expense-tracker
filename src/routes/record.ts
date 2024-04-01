import RecordController from '../controllers/record-controller'
import Route from './route'

class RecordRoute extends Route {
  private readonly recordController = new RecordController()

  constructor () {
    super()
    this.setRoutes()
  }

  protected setRoutes (): void {
    this.router.get('/edit/:id',
      this.recordController.editRecord.bind(this.recordController)
    )
    this.router.get('/new',
      this.recordController.addRecord.bind(this.recordController)
    )
    this.router.get('/',
      this.recordController.getRecords.bind(this.recordController)
    )
  }
}

export default RecordRoute
