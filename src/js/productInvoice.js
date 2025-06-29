import Framework7 from 'framework7'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import { getMontYear } from './helper/date.ts'
import { ApiMutationService } from './service/api/ApiMutationService.ts'
import { ApiService } from './service/api/ApiService'
import { handleSubmitFormInputFiles } from './service/form/formErrorInputs.ts'
import { formProductInvoiceFilesSchema } from './service/productInvoices/formProductInvoiceFilesSchema.ts'
import { getUrl, getUrlById, getUrlWithParameters } from './urlGenerator'

const URL_PRODUCT_INVOICE = '/api/product_invoice_files'
const URL_TO_REDIRECT = '/product/invoices/'

/**
 * @param {*} $f7
 * @param { Date } date
 * @returns
 */
async function getProductsInvoicesByUser($f7, date) {
  const formattedDate = date.toISOString().slice(0, 10)
  const url = getUrlWithParameters(URL_PRODUCT_INVOICE, {
    date: formattedDate,
  })

  const cache = await responseIsCached(url)
  if (cache) {
    return checkDataToGetOfAResponseCached(url)
  }

  return new ApiService($f7).call(url)
}

async function createProductInvoices(date, app) {
  const files = document.getElementById('files').files
  const formattedDate = date.toISOString().slice(0, 10)

  const url = getUrl(URL_PRODUCT_INVOICE)
  const body = getBody(files, formattedDate)
  if (
    !handleSubmitFormInputFiles(
      Object.fromEntries(body),
      formProductInvoiceFilesSchema,
      app,
    )
  ) {
    return
  }

  app.sheet.close()

  const routeDTO = new RouteDTO()
    .setApp(app)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(url)
    .setBody(body)
    .setMethod('POST')

  await new ApiMutationService(app).post(routeDTO, true)
}

/**
 * @param { Framework7 } $f7
 * @param { number } id
 */
async function deleteProductInvoice($f7, id) {
  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setIdElement(id)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(`${URL_PRODUCT_INVOICE}/`)

  await new ApiMutationService($f7).delete(routeDTO)
}

async function downloadFileProductInvoice($f7, productInvoice) {
  const url = getUrl(`${URL_PRODUCT_INVOICE}/${productInvoice.id}/download`)

  const routeDTO = new RouteDTO().setApp($f7).setUrlAPI(url).setMethod('GET')

  const productInvoiceNameSplitted = productInvoice.name.split('.').pop()
  const nameFile =
    productInvoiceNameSplitted === 'pdf'
      ? productInvoice.name
      : `${productInvoice.name}.pdf`

  await new ApiMutationService($f7).download(routeDTO, nameFile)
}

async function downloadZIP($f7, ids, date) {
  const url = getUrl(`${URL_PRODUCT_INVOICE}_download_zip`)
  let formattedDate = getMontYear(date)
  formattedDate = formattedDate.replace(' ', '_')

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setUrlAPI(url)
    .setBody(JSON.stringify({ ids: ids }))
    .setMethod('POST')

  await new ApiMutationService($f7).download(
    routeDTO,
    `Factures_${formattedDate}.zip`,
  )
}

async function updateProductInvoice($f7, id, form) {
  const url = getUrlById(`${URL_PRODUCT_INVOICE}/`, id)
  const body = JSON.stringify({
    name: form.name,
    date: form.date,
    totalAmount: Number.parseFloat(form['total-amount']),
  })

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setRoute(URL_TO_REDIRECT)
    .setUrlAPI(url)
    .setBody(body)
    .setMethod('PUT')

  await new ApiMutationService($f7).generic(routeDTO)
}

/**
 * @param { Object } body
 * @returns
 */
const getBody = (files, date) => {
  const formData = new FormData()
  formData.append('date', date)
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i])
  }

  return formData
}

export {
  getProductsInvoicesByUser,
  createProductInvoices,
  deleteProductInvoice,
  downloadFileProductInvoice,
  downloadZIP,
  updateProductInvoice,
}
