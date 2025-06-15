import type Framework7 from 'framework7'
import type WorkImageInteface from '../intefaces/WorkImage/WorkImageInterface'
import { deleteAPI, fetchCreate } from './api'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import { ApiService } from './service/api/ApiService'
import { handleSubmitFormInputFiles } from './service/form/formErrorInputs'
import { workImageSchema } from './service/workImage/workImageSchema'
import { getUrl, getUrlWithParameters } from './urlGenerator'

const URL_WORK_IMAGES = '/api/work_images'

export default class WorkImageService {
  constructor(
    private _app: Framework7,
    private _workId: number,
  ) {}

  public createWorkImage(): void {
    const images = document.getElementById('images') as HTMLInputElement
    const url: URL = getUrl(URL_WORK_IMAGES)
    const body = this.getBody(images.files ?? [])

    if (
      !handleSubmitFormInputFiles(
        Object.fromEntries(body),
        workImageSchema,
        this._app,
      )
    ) {
      return
    }

    this._app.sheet.close()

    const routeDTO = new RouteDTO()
      .setApp(this._app)
      .setRoute(`/prestation/${this._workId}`)
      .setUrlAPI(url)
      .setBody(body)
      .setMethod('POST')

    fetchCreate(routeDTO, 'formData')
  }

  public async getWorkImagesByWork(): Promise<WorkImageInteface[]> {
    const url = getUrlWithParameters(URL_WORK_IMAGES, {
      'work.id': this._workId,
    })

    const cache = await responseIsCached(url)
    if (cache) {
      return checkDataToGetOfAResponseCached(url)
    }

    const response = new ApiService(this._app).call(
      url,
    ) as unknown as WorkImageInteface[]

    return response
  }

  public async deleteWorkImage(id: number | undefined): Promise<void> {
    const routeDTO = new RouteDTO()
      .setApp(this._app)
      .setIdElement(id ?? 0)
      .setRoute(`/prestation/${this._workId}`)
      .setUrlAPI(`${URL_WORK_IMAGES}/`)

    deleteAPI(routeDTO)
  }

  private getBody(images: FileList | never[]): FormData {
    const formData = new FormData()
    formData.append('workId', this._workId.toString())
    for (let i = 0; i < images?.length; i++) {
      formData.append('images[]', images[i])
    }

    return formData
  }
}
