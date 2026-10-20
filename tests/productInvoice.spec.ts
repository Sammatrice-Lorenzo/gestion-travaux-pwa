import fs from 'node:fs'
import path from 'node:path'
import {
  type ElementHandle,
  type Locator,
  type Page,
  expect,
  test,
} from '@playwright/test'
import { goToHome } from './helper/homeHelper'

const NAME_FILE: string = 'facture_test.pdf'

test.describe('Product Invoice test', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL as string)
    await goToHome(page)

    const menu: ElementHandle<HTMLElement | SVGElement> =
      await page.waitForSelector('.panel-open')
    await menu.click()
    await page.getByText('Mes factures').click()

    await page.waitForSelector('.panel-backdrop-in', {
      state: 'visible',
      timeout: 60000,
    })
    await assertProductInvoiceIndexPage(page)

    await page.locator('.panel-backdrop-in').click()
  })

  test('should open upload modal and upload a file', async ({ page }) => {
    await page.locator('.fab > a').click()
    const uploadButton: Locator = page.locator('.fab-label-button').first()
    await uploadButton.click()

    const fileInput: Locator = page.locator('#files')
    const fileBuffer: NonSharedBuffer = fs.readFileSync(
      path.resolve(__dirname, './data/InvoiceTemplate.pdf'),
    )

    await fileInput.setInputFiles([
      {
        name: NAME_FILE,
        mimeType: 'application/pdf',
        buffer: fileBuffer,
      },
    ])

    const sendButton: Locator = page.locator('#btn-send-form-product-invoices')
    await sendButton.click()

    await page.locator('.dialog-button').click()
    await page.locator('.fab > a').click()
  })

  test('should upload a photo of a ticket', async ({ page }) => {
    let uploadedBody = ''
    await page.route(
      (url) => url.pathname === '/api/product_invoice_files',
      async (route) => {
        if (route.request().method() !== 'POST') {
          return route.continue()
        }

        uploadedBody = route.request().postData() ?? ''
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: '[]',
        })
      },
    )

    await openUploadSheet(page)
    await page.locator('#files-photo').setInputFiles({
      name: 'ticket.png',
      mimeType: 'image/png',
      buffer: PNG_1PX,
    })
    await page.locator('#btn-send-form-product-invoices').click()
    await page.locator('.dialog-button').click()

    expect(uploadedBody).toContain('filename="ticket.png"')
    expect(uploadedBody).toContain('Content-Type: image/png')
  })

  test('should refuse a file that is neither a PDF nor a photo', async ({
    page,
  }) => {
    await openUploadSheet(page)
    await page.locator('#files').setInputFiles({
      name: 'notes.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('pas une facture'),
    })
    await page.locator('#btn-send-form-product-invoices').click()

    await expect(page.locator('.toast')).toContainText(
      'Seuls les fichiers PDF et les photos',
    )
  })

  test('should display product invoices and interact with UI', async ({
    page,
  }) => {
    const textInvoiceCard: Locator = page.getByText(NAME_FILE).first()
    await expect(textInvoiceCard).toBeVisible()

    const invoiceCard = await getInvoiceCard(page)

    const checkbox = invoiceCard.locator('.checkbox')
    await expect(checkbox).toBeVisible({ timeout: 5000 })
    await checkbox.click()

    const selectedInfo: Locator = page.locator(
      '#total-product-invoice-selected',
    )
    await expect(selectedInfo).toContainText('1 facture(s) sélectionnée(s)')

    const previewButton: Locator = invoiceCard.locator(
      '.f7-icons:text("eye_fill")',
    )
    await expect(previewButton).toBeVisible({ timeout: 5000 })
    await previewButton.click()

    await expect(page.locator('#popup-preview-pdf')).toBeVisible({
      timeout: 15000,
    })
    // pdf.js actually rendered at least one page
    await expect(
      page.locator('#pdf-pages-container canvas').first(),
    ).toBeVisible({ timeout: 15000 })
  })

  test('should delete a selected invoice', async ({ page }) => {
    const invoiceCard = await getInvoiceCard(page)
    const trashButton: Locator = invoiceCard.locator('.f7-icons:text("trash")')
    await expect(trashButton).toBeVisible({ timeout: 5000 })
    await trashButton.click()

    const idProductInvoice = (await invoiceCard.getAttribute(
      'data-testid',
    )) as string
    const invoiceCardToDelete = page.getByTestId(idProductInvoice)

    await page.getByText('Ok').click()
    await page.getByText('Ok').click()
    await expect(invoiceCardToDelete).toBeHidden({ timeout: 5000 })
  })
})

const PNG_1PX: Buffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

const openUploadSheet = async (page: Page): Promise<void> => {
  await page.locator('.fab > a').click()
  await page.locator('.fab-label-button').first().click()
  await expect(page.locator('#btn-send-form-product-invoices')).toBeVisible()
}

const getInvoiceCard = async (page: Page): Promise<Locator> => {
  const invoiceCard = page.locator('.invoice-card').first()
  await expect(invoiceCard).toBeVisible({ timeout: 10000 })

  return invoiceCard
}

const assertProductInvoiceIndexPage = async (page: Page): Promise<void> => {
  const divClients: Locator = page.locator('#index-invoices')
  await expect(divClients).toBeVisible({
    timeout: 60000,
  })
}
