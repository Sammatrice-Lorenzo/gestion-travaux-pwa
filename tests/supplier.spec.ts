import { describe } from 'node:test'
import {
  type ElementHandle,
  type Locator,
  type Page,
  expect,
  test,
} from '@playwright/test'
import { goToHome } from './helper/homeHelper'

describe('Supplier test', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL as string)
    await goToHome(page)

    const menu: ElementHandle<HTMLElement | SVGElement> =
      await page.waitForSelector('.panel-open')
    await menu.click()
    await page.getByText('Fournisseurs').click()

    await page.waitForSelector('.panel-backdrop-in', {
      state: 'visible',
      timeout: 60000,
    })
    await assertIndexPageSuppliers(page)

    await page.locator('.panel-backdrop-in').click()
  })

  test('show supplier', async ({ page }) => {
    const rowSupplier: Locator = page.locator('.item-title-row').first()
    const rowTitle = rowSupplier.filter({ has: page.locator('.item-title') })
    const nameSupplier: string | null = await rowTitle.textContent()

    await rowSupplier.click()
    await expect(page.locator('#show-suppliers')).toBeVisible({
      timeout: 60000,
    })

    expect(nameSupplier).toEqual(
      await page.getByTestId('name-supplier').textContent(),
    )
  })

  test('Form Supplier', async ({ page, defaultBrowserType }) => {
    await page
      .locator('#index-suppliers')
      .getByRole('link', { name: 'Ajouter plus_app_fill' })
      .click()
    await page.waitForSelector('#form-supplier')

    const name: string = `Bricoman ${defaultBrowserType}`
    await fillFormSupplier(page, name)

    await page.locator('.dialog-button').click()

    await assertInformationsForm(page, name)

    await page.getByText(name).click()
    await page.getByTestId('edit-supplier').click()
    await page.waitForSelector('#form-supplier')

    await fillFormSupplier(page, name)
    await assertInformationsForm(page, name)
  })
})

const assertInformationsForm = async (page: Page, elementToSearch: string) => {
  const element = page.getByText(elementToSearch)
  expect(element).not.toBeNull()
}

const fillFormSupplier = async (page: Page, name: string) => {
  await page.locator('input[name=name]').fill(name)
  await page.locator('input[name=address]').fill('Rue Commerciale')
  await page.locator('input[name=city]').fill('Paris')
  await page.locator('input[name=country]').fill('France')
  await page.locator('input[name=phone]').fill('0601020304')
  await page.locator('input[name=vatNumber]').fill('FR32123456789')

  await page.getByRole('button').click()
}

const assertIndexPageSuppliers = async (page: Page): Promise<void> => {
  const divSuppliers: Locator = page.locator('#index-suppliers')
  await expect(divSuppliers).toBeVisible({
    timeout: 60000,
  })
}
