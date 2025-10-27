import type Framework7 from 'framework7'
import type SupplierInterface from '../intefaces/Supplier/SupplierInterface'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import { ApiMutationService } from './service/api/ApiMutationService'
import { type ApiResponse, ApiService } from './service/api/ApiService'
import { handleSubmitForm } from './service/form/formErrorInputs'
import { supplierSchema } from './service/schema/supplier/supplierSchema'
import { getUrl, getUrlById } from './urlGenerator'

const URL_SUPPLIER: string = '/api/suppliers'
const URL_TO_REDIRECT: string = '/suppliers/'
const ID_FORM: string = 'form-supplier'

export default class Supplier {
  constructor(private _app: Framework7) {}

  public async createSupplier(form: SupplierInterface) {
    if (!handleSubmitForm(form, supplierSchema, ID_FORM)) {
      return
    }

    const url: URL = getUrl(URL_SUPPLIER)
    const body = this.getBody(form)

    const routeDTO: RouteDTO = new RouteDTO()
      .setApp(this._app)
      .setRoute(URL_TO_REDIRECT)
      .setUrlAPI(url)
      .setBody(body)

    await new ApiMutationService(this._app).post(routeDTO)
  }

  public async getSuppliersByUser(): Promise<ApiResponse<SupplierInterface>> {
    const url: URL = getUrl(URL_SUPPLIER)

    const hasCache: boolean = await responseIsCached(url)

    if (hasCache) {
      return checkDataToGetOfAResponseCached<SupplierInterface[]>(url)
    }

    return new ApiService(this._app).call(url)
  }

  public async findSupplier(id: number): Promise<SupplierInterface> {
    const url = getUrlById(`${URL_SUPPLIER}/`, id)

    const apiService: ApiService = new ApiService(this._app)
    const response: ApiResponse<SupplierInterface> = await apiService.call(url)

    return response[0]
  }

  public async updateSupplier(
    form: SupplierInterface,
    idSupplier: number,
  ): Promise<void> {
    const url: URL = getUrlById(`${URL_SUPPLIER}/`, idSupplier)
    const body: string = this.getBody(form)

    if (!handleSubmitForm(form, supplierSchema, ID_FORM)) {
      return
    }

    const routeDTO = new RouteDTO()
      .setApp(this._app)
      .setRoute(URL_TO_REDIRECT)
      .setUrlAPI(url)
      .setBody(body)
      .setMethod('PUT')

    await new ApiMutationService(this._app).generic(routeDTO)
  }

  public async deleteSupplier(idSupplier: number): Promise<void> {
    const routeDTO = new RouteDTO()
      .setApp(this._app)
      .setIdElement(idSupplier)
      .setRoute(URL_TO_REDIRECT)
      .setUrlAPI(`${URL_SUPPLIER}/`)

    await new ApiMutationService(this._app).delete(routeDTO)
  }

  private getBody(form: SupplierInterface): string {
    return JSON.stringify({
      name: form.name,
      address: form.address,
      city: form.city,
      country: form.country,
      phone: form.phone,
      vatNumber: form.vatNumber,
    })
  }
}
