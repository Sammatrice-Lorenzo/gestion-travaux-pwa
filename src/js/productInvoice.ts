import Framework7 from 'framework7'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import sheetModalProductInvoiceFormatter from './formatter/sheetModalProductInvoiceFormatter'
import { getMontYear, toDateLocalString } from './helper/date'
import { ApiMutationService } from './service/api/ApiMutationService'
import { ApiService } from './service/api/ApiService'
import { handleSubmitFormInputFiles } from './service/form/formErrorInputs'
import { formProductInvoiceFilesSchema } from './service/schema/productInvoice/formProductInvoiceFilesSchema'
import { getUrl, getUrlById, getUrlWithParameters } from './urlGenerator'

const URL_PRODUCT_INVOICE = '/api/product_invoice_files'
const URL_TO_REDIRECT = '/product/invoices/'

/**
 * @param {*} $f7
 * @param { Date } date
 * @returns { Promise<ProductInvoiceInterface[]> }
 */
async function getProductsInvoicesByUser($f7, date) {
  const formattedDate = toDateLocalString(date)
  const url = getUrlWithParameters(URL_PRODUCT_INVOICE, {
    date: formattedDate,
  })

  const cache = await responseIsCached(url)
  if (cache) {
    return checkDataToGetOfAResponseCached(url)
  }

  return new ApiService($f7).call(url)
}

/**
 * Fichiers choisis et photo prise avec l'appareil : tous partent dans la même requête.
 *
 * @returns { File[] }
 */
const getSelectedFiles = () => {
  const { inputId, captureInputId } = sheetModalProductInvoiceFormatter

  return [inputId, captureInputId]
    .filter(Boolean)
    .flatMap((id) => Array.from(document.getElementById(id)?.files ?? []))
}

async function createProductInvoices(date, app) {
  const files = getSelectedFiles()
  const formattedDate = toDateLocalString(date)

  const url = getUrl(URL_PRODUCT_INVOICE)
  if (
    !handleSubmitFormInputFiles(
      { date: formattedDate, files },
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
    .setBody(getBody(files, formattedDate))
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
    supplierId: Number.parseInt(form.supplier),
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
