import type Framework7 from 'framework7'
import type SupplierReturnInvoiceInterface from '../intefaces/SupplierReturn/SupplierReturnInvoiceInterface'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { SUPPLIER_SELECT_ID } from './components/modalUploadFiles.ts'
import { RouteDTO } from './dto/RouteDTO'
import { getMontYear } from './helper/date.ts'
import { ApiMutationService } from './service/api/ApiMutationService.ts'
import { ApiService } from './service/api/ApiService'
import { handleSubmitFormInputFiles } from './service/form/formErrorInputs.ts'
import { formSupplierReturnFilesSchema } from './service/schema/supplierReturn/formSupplierReturnFilesSchema.ts'
import { getUrl, getUrlById, getUrlWithParameters } from './urlGenerator'

const URL_API = '/api/supplier_return_invoice_files'
const URL_REDIRECT = '/supplier/returns/'
const FILES_INPUT_ID = 'return-files'

const getBody = (files: FileList, date: string): FormData => {
  const formData = new FormData()
  formData.append('date', date)
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i])
  }

  return formData
}

async function getSupplierReturnInvoicesByUser(
  $f7: Framework7,
  date: Date,
): Promise<SupplierReturnInvoiceInterface[]> {
  const formattedDate = date.toISOString().slice(0, 10)
  const url = getUrlWithParameters(URL_API, { date: formattedDate })

  if (await responseIsCached(url)) {
    return checkDataToGetOfAResponseCached<SupplierReturnInvoiceInterface>(url)
  }

  return new ApiService($f7).call<SupplierReturnInvoiceInterface>(url)
}

async function createSupplierReturnInvoices(
  date: Date,
  app: Framework7,
): Promise<void> {
  const filesInput = document.getElementById(FILES_INPUT_ID) as HTMLInputElement
  const files = filesInput?.files
  if (!files?.length) {
    app.dialog.alert('Veuillez sélectionner au moins un fichier PDF.')
    return
  }

  const formattedDate = date.toISOString().slice(0, 10)
  const body = getBody(files, formattedDate)

  const supplierSelect = document.getElementById(
    SUPPLIER_SELECT_ID,
  ) as HTMLSelectElement | null
  if (supplierSelect?.value) {
    body.append('supplierId', supplierSelect.value)
  }

  if (
    !handleSubmitFormInputFiles(
      Object.fromEntries(body),
      formSupplierReturnFilesSchema,
      app,
    )
  ) {
    return
  }

  app.sheet.close()

  const routeDTO = new RouteDTO()
    .setApp(app)
    .setRoute(URL_REDIRECT)
    .setUrlAPI(getUrl(URL_API))
    .setBody(body)
    .setMethod('POST')

  await new ApiMutationService(app).post(routeDTO, true)
}

async function deleteSupplierReturnInvoice(
  $f7: Framework7,
  id: number,
): Promise<void> {
  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setIdElement(id)
    .setRoute(URL_REDIRECT)
    .setUrlAPI(`${URL_API}/`)

  await new ApiMutationService($f7).delete(routeDTO)
}

async function downloadSupplierReturnInvoice(
  $f7: Framework7,
  invoice: Pick<SupplierReturnInvoiceInterface, 'id' | 'name'>,
): Promise<void> {
  const url = getUrl(`${URL_API}/${invoice.id}/download`)
  const routeDTO = new RouteDTO().setApp($f7).setUrlAPI(url).setMethod('GET')
  const ext = invoice.name.split('.').pop()
  const nameFile = ext === 'pdf' ? invoice.name : `${invoice.name}.pdf`
  await new ApiMutationService($f7).download(routeDTO, nameFile)
}

async function downloadSupplierReturnZIP(
  $f7: Framework7,
  ids: number[],
  date: Date,
): Promise<void> {
  const url = getUrl(`${URL_API}_download_zip`)
  const formattedDate = getMontYear(date).replace(' ', '_')
  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setUrlAPI(url)
    .setBody(JSON.stringify({ ids }))
    .setMethod('POST')

  await new ApiMutationService($f7).download(
    routeDTO,
    `Retours_fournisseur_${formattedDate}.zip`,
  )
}

async function updateSupplierReturnInvoice(
  $f7: Framework7,
  id: number,
  form: Record<string, string>,
): Promise<void> {
  const url = getUrlById(`${URL_API}/`, id)
  const body = JSON.stringify({
    name: form.name,
    date: form.date,
    creditAmount: Number.parseFloat(form['credit-amount']),
    supplierId: form.supplier ? Number.parseInt(form.supplier) : null,
    linkedProductInvoiceId: form['linked-invoice']
      ? Number.parseInt(form['linked-invoice'])
      : null,
  })

  const routeDTO = new RouteDTO()
    .setApp($f7)
    .setRoute(URL_REDIRECT)
    .setUrlAPI(url)
    .setBody(body)
    .setMethod('PUT')

  await new ApiMutationService($f7).generic(routeDTO)
}

export {
  getSupplierReturnInvoicesByUser,
  createSupplierReturnInvoices,
  deleteSupplierReturnInvoice,
  downloadSupplierReturnInvoice,
  downloadSupplierReturnZIP,
  updateSupplierReturnInvoice,
}
