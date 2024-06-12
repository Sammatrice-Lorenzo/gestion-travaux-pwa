import { fetchFileAPI } from './api'
import { RouteDTO } from './dto/RouteDTO'

/**
 * @param { Dom7 } $$
 * @param { any } $f7 
 * @returns { boolean }
 */
function isValidForm($$, $f7) {
    const form = $$('form#form-work-invoice')
    const inputs = $$(form).find('input')

    let isValid = true

    inputs.forEach(function(input) {
        const divParent = $$(input).closest('.item-inner')
        if (input.value.trim() === '' && input.name !== 'localisation') {
            isValid = false
            const label = $$(divParent).find('.item-title').text()
            $f7.dialog.alert(`${label} ne peut pas être vide.`)
        }
    })

    return isValid
}

/**
 * @param { Object } form 
 * @param { number } idClient 
 */
function getBody(form, idClient) {
    const invoiceLines = Object.values(form)
    const nameInvoice = invoiceLines.shift()

    const chunk = (arr, size) => 
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        )
    
    return JSON.stringify({
        nameInvoice: nameInvoice,
        invoiceLines: chunk(invoiceLines, 4),
        idClient: idClient
    })
}

/**
 * @param { FormData } form 
 * @param { any } $f7 
 * @param { number } idClient 
 */
function createInvoiceWork(form, $f7, idClient)
{
    const body = getBody(form, idClient)

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setUrlAPI('/api/invoice-file')
        .setBody(body)

    fetchFileAPI(routeDTO, 'facture_prestation.pdf')
}

export { createInvoiceWork, isValidForm }