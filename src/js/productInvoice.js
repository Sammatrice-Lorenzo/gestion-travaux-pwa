import Framework7 from "framework7"
import { callAPI, deleteAPI, fetchFileAPI, sendFilesAPI } from "./api"
import { checkDataToGetOfAResponseCached, responseIsCached } from "./cache"
import { RouteDTO } from "./dto/RouteDTO"
import { getUrl, getUrlById, getUrlWithParameters } from "./urlGenerator"
import Framework7DTO from "./Framework7DTO"
import { getMontYear } from "./date"

const URL_PRODUCT_INVOICE_BY_USER = '/api/product_invoice/month'
const URL_PRODUCT_INVOICE_DELETE = '/api/product_invoice_delete/'
const URL_PRODUCT_INVOICE_DOWNLOAD_PDF = '/api/product_invoice_download/'
const URL_PRODUCT_INVOICE_DOWNLOAD_ZIP = '/api/product_invoice_download_zip'
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

    sendFilesAPI(routeDTO)
}

/**
 * @param { Framework7 } $f7 
 * @param { String } id 
 */
async function deleteProductInvoice($f7, id) {

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setIdElement(id)
        .setRoute(URL_TO_REDIRECT)
        .setUrlAPI(URL_PRODUCT_INVOICE_DELETE)

    deleteAPI(routeDTO, true)
}

function downloadFileProductInvoice($f7, productInvoice) {
    const url = getUrlById(URL_PRODUCT_INVOICE_DOWNLOAD_PDF, productInvoice.id)

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setUrlAPI(url)
        .setBody({})

    fetchFileAPI(routeDTO, `${productInvoice.name}.pdf`)
}

function downloadZIP($f7, ids, date) {
    const url = getUrl(URL_PRODUCT_INVOICE_DOWNLOAD_ZIP)
    let formattedDate = getMontYear(date)
    formattedDate = formattedDate.replace(' ', '_')

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setUrlAPI(url)
        .setBody(JSON.stringify({ids: ids}))

    fetchFileAPI(routeDTO, `Factures_${formattedDate}.zip`)
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

export { 
    getProductsInvoicesByUser,
    createProductInvoices,
    isValidForm,
    deleteProductInvoice,
    downloadFileProductInvoice,
    downloadZIP
 }