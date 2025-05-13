import Framework7 from 'framework7'
import { apiRequest, callAPI, deleteAPI, fetchFileAPI, fetchCreate } from './api'
import { checkDataToGetOfAResponseCached, responseIsCached } from './cache'
import { RouteDTO } from './dto/RouteDTO'
import { getUrl, getUrlById, getUrlWithParameters } from './urlGenerator'
import Framework7DTO from './Framework7DTO'
import { getMontYear } from './date'

const URL_PRODUCT_INVOICE = '/api/product_invoice_files'
const URL_TO_REDIRECT = '/product/invoices/'

/**
 * @param {*} $f7 
 * @param { Date } date 
 * @returns 
 */
async function getProductsInvoicesByUser($f7, date) {
    const formattedDate = date.toISOString().slice(0, 10)
    const url = getUrlWithParameters(URL_PRODUCT_INVOICE, {date: formattedDate})

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

    const url = getUrl(URL_PRODUCT_INVOICE)
    const body = getBody(files, formattedDate)

    const routeDTO = new RouteDTO()
        .setApp(framework7DTO.getApp())
        .setRoute(URL_TO_REDIRECT)
        .setUrlAPI(url)
        .setBody(body)
        .setMethod('POST')

    fetchCreate(routeDTO, 'formData')
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
        .setUrlAPI(`${URL_PRODUCT_INVOICE}/`)

    deleteAPI(routeDTO)
}

function downloadFileProductInvoice($f7, productInvoice) {
    const url = getUrl(`${URL_PRODUCT_INVOICE}/${productInvoice.id}/download`)

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setUrlAPI(url)
        .setMethod('GET')

    const productInvoiceNameSplitted = productInvoice.name.split('.').pop()
    const nameFile = productInvoiceNameSplitted === 'pdf' ? productInvoice.name : `${productInvoice.name}.pdf`

    fetchFileAPI(routeDTO, nameFile)
}

function downloadZIP($f7, ids, date) {
    const url = getUrl(`${URL_PRODUCT_INVOICE}_download_zip`)
    let formattedDate = getMontYear(date)
    formattedDate = formattedDate.replace(' ', '_')

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setUrlAPI(url)
        .setBody(JSON.stringify({ids: ids}))
        .setMethod('POST')

    fetchFileAPI(routeDTO, `Factures_${formattedDate}.zip`)
}

function updateProductInvoice($f7, id, form) {
    const url = getUrlById(`${URL_PRODUCT_INVOICE}/`, id)
    const body = JSON.stringify({
        name: form.name,
        date: form.date,
        totalAmount: Number.parseFloat(form['total-amount'])
    })

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setRoute(URL_TO_REDIRECT)
        .setUrlAPI(url)
        .setBody(body)
        .setMethod('PUT')

    apiRequest(routeDTO)
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
        $f7.dialog.alert('Aucun fichier sélectionné.')
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
    downloadZIP,
    updateProductInvoice
}