import { getToken } from "../../token"
import { getUrl } from "../../urlGenerator"

let scale = 1
let pdfDoc = null

const getScaleViewport = (page, pdfContainer) => {
    const containerWidth = pdfContainer.clientWidth
    const initialViewport = page.getViewport({ scale: scale })
    scale = containerWidth / initialViewport.width

    return page.getViewport({ scale })
}

async function openPdfPreviewFromUrl(framework7DTO, id, pdfPreviewPopup) {
    const url = getUrl(`/api/product_invoice_files/${id}/download/`)
    const token = getToken()

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf', 
                'Authorization': `Bearer ${token}`,
            },
        })
        const pdfBlob = await response.blob()
        const pdfData = await pdfBlob.arrayBuffer()

        pdfPreviewPopup(framework7DTO).open()
        const container = document.getElementById('pdf-pages-container')
        await displayPdfInCanvas(pdfData, container)
    } catch (error) {
        console.error('Erreur lors du chargement du PDF:', error)
        framework7DTO.getApp().dialog.alert('Impossible de charger le PDF.')
    }
}

async function displayPdfInCanvas(pdfData, container, isZoom = false) {
    if (!isZoom) {
        pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise
    }

    for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
        const page = await pdfDoc.getPage(pageNumber)
        const viewport = getScaleViewport(page, container)

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvasContext: context, viewport: viewport }).promise
        container.appendChild(canvas)
    }
}

async function updateZoom(newScale) {
    scale = newScale
    const pdfContainer = document.getElementById('pdf-pages-container')
    
    if (pdfContainer) {
        pdfContainer.innerHTML = ''
        await displayPdfInCanvas(pdfDoc, pdfContainer, true)
    }
}

export { openPdfPreviewFromUrl, updateZoom, scale }