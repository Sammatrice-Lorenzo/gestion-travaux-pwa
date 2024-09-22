import { callAPI, sendFilesAPI } from "./api"
import { checkDataToGetOfAResponseCached, responseIsCached } from "./cache"
import { RouteDTO } from "./dto/RouteDTO"
import { getUrl, getUrlWithParameters } from "./urlGenerator"

const URL_PRODUCT_INVOICE_BY_USER = '/api/product_invoice/month'
const URL_PRODUCT_INVOICE_SEND_FILES = '/api/product_invoice_files'
const URL_TO_REDIRECT = '/product/invoices/'

/**
 * @param {*} $f7 
 * @param { Date } date 
 * @returns 
 */
async function getProductsInvoicesByUser($f7, date) {
    const formattedDate = date.toISOString().slice(0, 10)
    const url = getUrlWithParameters(URL_PRODUCT_INVOICE_BY_USER, {date: formattedDate})

    const cache = await responseIsCached(url)
    if (cache) {
        return checkDataToGetOfAResponseCached(url)
    }

    return callAPI(url, $f7)
}

async function createProductInvoices(date, framework7DTO) {
    const files = document.getElementById('files').files
    if (!isValidForm(framework7DTO, files)) {
        return
    }
    
    const formattedDate = date.toISOString().slice(0, 10)
    const url = getUrl(URL_PRODUCT_INVOICE_SEND_FILES)
    const body = getBody(files, formattedDate)

    const routeDTO = new RouteDTO()
        .setApp(framework7DTO.getApp())
        .setRoute(URL_TO_REDIRECT)
        .setUrlAPI(url)
        .setBody(body)
        .setMethod('POST')
        .setContentType('multipart/form-data')

    return sendFilesAPI(routeDTO)
}

/**
 * @param { Object } body 
 * @returns 
 */
const getBody = (files, date) => {
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
        formData.append(`file${i}`, files[i])
    }

    formData.append('date', date)

    return formData
}

/**
 * @param { Framework7DTO } framework7DTO 
 * @param { File } files 
 * @returns { Boolean }
 */
function isValidForm(framework7DTO, files) {
    const $ = framework7DTO.getSelector()
    const $f7 = framework7DTO.getApp()

    const form = $('form#form-product-invoices')
    const input = $(form).find('input')[0]

    let isValid = true

    if (input.value.trim() === '') {
        isValid = false
        $f7.dialog.alert(`Aucun fichier sélectionné.`)
    }

    for (const file of files) {
        if (file.type !== 'application/pdf') {
            isValid = false
            const fileName = file.name
            $f7.dialog.alert(`Le fichier ${fileName} n'est pas un pdf.`)
        }
    }
    
    return isValid
}

export { getProductsInvoicesByUser, createProductInvoices, isValidForm }