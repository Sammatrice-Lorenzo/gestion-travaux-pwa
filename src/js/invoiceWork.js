import { fetchFileAPI } from './api'
import { RouteDTO } from './dto/RouteDTO'
import { addInvoiceLineForUpdate } from './work/component/invoiceLineComponent.js'

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
        if (input.value.trim() === '' && !input.name.startsWith('localisation')) {
            isValid = false
            const label = $$(divParent).find('.item-title').text()
            $f7.dialog.alert(`${label} ne peut pas être vide.`)
        }
    })

    return isValid
}

/**
 * @param { Object } form 
 * @param { Object } props 
 */
function getBody(form, props) {
    const invoiceLines = Object.values(form)
    const nameInvoice = invoiceLines.shift()
    const work = JSON.parse(props.prestation)

    const chunk = (arr, size) => 
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        )

    return JSON.stringify({
        nameInvoice: nameInvoice,
        invoiceLines: chunk(invoiceLines, 4),
        idClient: props.clientId,
        idWork: work.id,
    })
}

/**
 * @param { FormData } form 
 * @param { any } $f7 
 * @param { Object } props 
 */
function createInvoiceWork(form, $f7, props)
{
    const body = getBody(form, props)

    const routeDTO = new RouteDTO()
        .setApp($f7)
        .setUrlAPI('/api/invoice-file')
        .setBody(body)

    fetchFileAPI(routeDTO, 'facture_prestation.pdf')
}

function showInvoiceForUpdate(invoice, $f7) {
    const firstInvoiceLine = invoice.invoiceLines[0]

    const formInvoice = {
        name: invoice.title,
        localisation: firstInvoiceLine.localisation,
        description: firstInvoiceLine.description,
        price_unitaire: firstInvoiceLine.unitPrice,
        total_line: firstInvoiceLine.totalPriceLine
    }

    $f7.form.fillFromData('#form-work-invoice', formInvoice)

    if (invoice.invoiceLines.length > 1) {
        addInvoiceLineForUpdate(invoice.invoiceLines, $f7)
    }
}

export { createInvoiceWork, isValidForm, showInvoiceForUpdate }