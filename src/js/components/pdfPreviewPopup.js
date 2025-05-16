import { scale, updateZoom } from '../service/productInvoices/previewPdfService'

const handleZoomInMobile = (container) => {
  container.addEventListener('gesturechange', (event) => {
    event.preventDefault()
    let newScale = event.scale * scale
    newScale = Math.min(Math.max(0.5, newScale), 3)
    updateZoom(newScale)
  })

  container.addEventListener('gestureend', (event) => {
    const newScale = Math.min(Math.max(0.1, event.scale), 5)
    updateZoom(newScale)
  })
}

const handleZoomMouse = (container) => {
  container.addEventListener('wheel', (event) => {
    event.preventDefault()
    let newScale = scale + event.deltaY * -0.001
    newScale = Math.min(Math.max(0.5, newScale), 5)
    updateZoom(newScale)
  })
}

const pdfPreviewPopup = (framework7DTO) => {
  return framework7DTO.getApp().popup.create({
    content: `
            <div class="popup">
                <div class="view">
                    <div class="page">
                        <div class="navbar">
                            <div class="navbar-inner">
                                <div class="title">Prévisualisation PDF</div>
                                <div class="right">
                                    <a href="#" class="link popup-close">
                                        <i class="f7-icons">xmark_circle</i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="page-content">
                            <div id="pdf-pages-container" class="block" style="text-align: center">
                                <canvas id="pdf-preview-canvas" style="width: 100%"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
    on: {
      opened: () => {
        const container = document.getElementById('pdf-pages-container')
        handleZoomMouse(container)
        handleZoomInMobile(container)
      },
    },
  })
}

export { pdfPreviewPopup }
