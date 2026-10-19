import {
  type ElementHandle,
  type Locator,
  type Page,
  type Route,
  expect,
  test,
} from '@playwright/test'
import { goToHome } from './helper/homeHelper'

const QONTO_INVOICE_ID = 987654
const SUPPLIER_TO_COMPLETE = 'Fournisseur Qonto à compléter'

const hydra = (members: unknown[]) => ({
  'hydra:member': members,
  'hydra:totalItems': members.length,
})

const fulfillJson = (route: Route, body: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  })

/**
 * L'API est simulée : la synchro réelle tourne côté serveur (worker) et dépend de Qonto.
 */
const mockApi = async (page: Page): Promise<void> => {
  await page.route(
    (url) => url.pathname === '/api/product_invoice_files',
    (route) =>
      fulfillJson(
        route,
        hydra([
          {
            id: QONTO_INVOICE_ID,
            name: 'F-2026-QONTO',
            path: 'f-2026-qonto.pdf',
            date: new Date().toISOString(),
            totalAmount: 120.5,
            source: 'qonto',
            supplier: { id: 1, name: SUPPLIER_TO_COMPLETE },
            linkedSupplierReturns: [],
          },
        ]),
      ),
  )

  await page.route(
    (url) => url.pathname === '/api/suppliers',
    (route) =>
      fulfillJson(
        route,
        hydra([
          {
            id: 1,
            name: SUPPLIER_TO_COMPLETE,
            address: null,
            city: null,
            country: null,
          },
          {
            id: 2,
            name: 'Fournisseur complet',
            address: '1 rue du Test',
            city: 'Paris',
            country: 'France',
          },
        ]),
      ),
  )
}

const mockSync = async (
  page: Page,
  status: number,
  body: unknown,
): Promise<{ calls: number }> => {
  const counter = { calls: 0 }
  await page.route('**/api/qonto/supplier_invoices/sync', (route) => {
    counter.calls++
    return fulfillJson(route, body, status)
  })

  return counter
}

test.describe('Qonto sync', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await mockApi(page)

    await page.goto(baseURL as string)
    await goToHome(page)

    const menu: ElementHandle<HTMLElement | SVGElement> =
      await page.waitForSelector('.panel-open')
    await menu.click()
    await page.getByText('Mes factures').click()

    await expect(page.locator('#index-invoices')).toBeVisible({
      timeout: 60000,
    })
    await page.locator('.panel-backdrop-in').click()
  })

  test('shows the Qonto badge on imported invoices', async ({ page }) => {
    const card: Locator = page.getByTestId(`invoice-card-${QONTO_INVOICE_ID}`)
    await expect(card).toBeVisible({ timeout: 10000 })
    await expect(
      card.getByTestId(`qonto-badge-${QONTO_INVOICE_ID}`),
    ).toHaveText('Qonto')
  })

  test('starts a sync and confirms it', async ({ page }) => {
    const sync = await mockSync(page, 202, {
      message: 'Synchronisation lancée.',
    })

    await page.getByTestId('qonto-sync-button').click()

    await expect(page.locator('.toast')).toContainText(
      'Synchronisation Qonto lancée',
    )
    expect(sync.calls).toBe(1)
  })

  test('shows the reason when sync is refused', async ({ page }) => {
    const message =
      "La synchronisation Qonto n'est pas disponible pour ce compte."
    await mockSync(page, 403, { message })

    await page.getByTestId('qonto-sync-button').click()

    await expect(page.locator('.toast')).toContainText(message)
  })

  test('links to suppliers to complete', async ({ page }) => {
    const link: Locator = page.getByTestId('suppliers-to-complete-link')
    await expect(link).toContainText('1 fournisseur à compléter')

    await link.click()

    const suppliersPage: Locator = page.locator('#index-suppliers')
    await expect(suppliersPage).toBeVisible({ timeout: 10000 })
    await expect(suppliersPage).toContainText('Fournisseurs à compléter')
    await expect(suppliersPage.getByText(SUPPLIER_TO_COMPLETE)).toBeVisible()
    await expect(suppliersPage.getByText('Fournisseur complet')).toHaveCount(0)
  })
})
