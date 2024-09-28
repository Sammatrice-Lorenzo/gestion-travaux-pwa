import Framework7DTO from "../../Framework7DTO"
import { CONFIRMATION_TO_DELETE } from "../../messages"
import { deleteProductInvoice, downloadFileProductInvoice, downloadZIP } from "../../productInvoice"
import { getIdOfElementClicked } from '../../helper/domElementClick'

/**
 * @param { HTMLElement } element 
 * @param { Framework7DTO } framework7DTO 
 * @param { CallableFunction } $update 
 */
const openConfirm = (element, framework7DTO, $update) => {
    const $f7 = framework7DTO.getApp()

    $f7.dialog.confirm(CONFIRMATION_TO_DELETE, function () {
        const invoiceId = getIdOfElementClicked(framework7DTO.getSelector(), element)
        deleteProductInvoice($f7, invoiceId)

        $update
    })
}

/**
 * @param { HTMLElement } element 
 * @param {  Framework7DTO } framework7DTO 
 * @param { Array } productInvoicesByUser 
 */
const downloadPDF = (element, framework7DTO, productInvoicesByUser) => {
    const $f7 = framework7DTO.getApp()

    const invoiceId = getIdOfElementClicked(framework7DTO.getSelector(), element)
    const productInvoice = productInvoicesByUser.filter(productInvoice => productInvoice.id === parseInt(invoiceId))[0]

    downloadFileProductInvoice($f7, productInvoice)
}

/**
 * 
 * @param { String[] } selectedInvoices 
 * @param {*} $f7 
 * @param { Date } date 
 * @returns { void }
 */
const downloadSelectedInvoices = (selectedInvoices, $f7, date) => {
    if (selectedInvoices.length < 1) {
        $f7.dialog.alert('Veuillez sélectionner au moins une facture')
        return
    }

    downloadZIP($f7, selectedInvoices, date)
}

export {
    openConfirm,
    downloadPDF,
    downloadSelectedInvoices
}