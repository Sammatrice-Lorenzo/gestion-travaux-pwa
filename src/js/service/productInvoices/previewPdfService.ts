import type Framework7 from 'framework7'
import type { Popup } from 'framework7/components/popup'
import * as pdfjsLib from 'pdfjs-dist'
import { getUrl } from '../../urlGenerator'
import { apiCredentials } from '../SessionService'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

let scale = 1
let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null

const getScaleViewport = (
  page: pdfjsLib.PDFPageProxy,
  pdfContainer: HTMLElement,
): pdfjsLib.PageViewport => {
  const containerWidth = pdfContainer.clientWidth
  const initialViewport = page.getViewport({ scale })
  scale = containerWidth / initialViewport.width

  return page.getViewport({ scale })
}

async function openPdfPreviewFromUrl(
  app: Framework7,
  id: number,
  pdfPreviewPopup: (app: Framework7) => Popup.Popup,
  apiResource = 'product_invoice_files',
): Promise<void> {
  const url: URL = getUrl(`/api/${apiResource}/${id}/download`)

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: apiCredentials,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const pdfBlob: Blob = await response.blob()
    if (
      pdfBlob.size === 0 ||
      (pdfBlob.type &&
        !pdfBlob.type.includes('pdf') &&
        pdfBlob.type.includes('json'))
    ) {
      throw new Error('Réponse invalide (fichier PDF introuvable)')
    }

    scale = 1
    pdfDoc = null

    const pdfData: ArrayBuffer = await pdfBlob.arrayBuffer()

    const popup: Popup.Popup = pdfPreviewPopup(app)
    popup.open()

    const container: HTMLElement | null = document.getElementById(
      'pdf-pages-container',
    )
    if (container) {
      container.innerHTML = ''
      await displayPdfInCanvas(pdfData, container)
    }
  } catch (error) {
    console.error('Erreur lors du chargement du PDF:', error)
    app.dialog.alert('Impossible de charger le PDF.')
  }
}

async function displayPdfInCanvas(
  pdfData: ArrayBuffer | null,
  container: HTMLElement,
  isZoom = false,
): Promise<void> {
  if (!isZoom && pdfData) {
    pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise
  }

  if (!pdfDoc) return

  container.innerHTML = ''

  for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
    const page = await pdfDoc.getPage(pageNumber)
    const viewport: pdfjsLib.PageViewport = getScaleViewport(page, container)

    const canvas: HTMLCanvasElement = document.createElement('canvas')
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (!context) continue

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({ canvasContext: context, viewport, canvas }).promise
    container.appendChild(canvas)
  }
}

async function updateZoom(newScale: number): Promise<void> {
  scale = newScale
  const pdfContainer = document.getElementById('pdf-pages-container')
  if (pdfContainer && pdfDoc) {
    await displayPdfInCanvas(null, pdfContainer, true)
  }
}

export { openPdfPreviewFromUrl, updateZoom, scale }
