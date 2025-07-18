import { describe } from 'node:test'
import {
  type ElementHandle,
  type Locator,
  type Page,
  expect,
  test,
} from '@playwright/test'
import { goToHome } from './helper/homeHelper'

describe('Client test', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL as string)
    await goToHome(page)

    const menu: ElementHandle<HTMLElement | SVGElement> =
      await page.waitForSelector('.panel-open')
    await menu.click()
    await page.getByText('Clients').click()

    await page.waitForSelector('.panel-backdrop-in', {
      state: 'visible',
      timeout: 60000,
    })
    await assertIndexPageClients(page)

    await page.locator('.panel-backdrop-in').click()
  })

  test('show client', async ({ page }) => {
    const rowClient: Locator = page.locator('.item-title-row').first()
    const rowTitle = rowClient.filter({ has: page.locator('.item-title') })
    const nameClient: string | null = await rowTitle.textContent()

    await rowClient.click()
    await expect(page.locator('#show-clients')).toBeVisible({
      timeout: 60000,
    })

    expect(nameClient).toEqual(
      await page.getByTestId('name-client').textContent(),
    )
  })

  test('Create client', async ({ page, defaultBrowserType }) => {
    await page
      .locator('#index-client')
      .getByRole('link', { name: 'Ajouter plus_app_fill' })
      .click()
    await page.waitForSelector('#form-client')

    const firstname: string = 'John'
    const lastname: string = `Client${defaultBrowserType}`
    await fillFormClient(page, firstname, lastname)
    await page.getByRole('button').click()

    await page.locator('.dialog-button').click()

    const element = await page.$(`text="${firstname} ${lastname}"`)
    expect(element).not.toBeNull()
  })
})

const fillFormClient = async (
  page: Page,
  firstname: string,
  lastname: string,
) => {
  await page.locator('input[name=firstname]').fill(firstname)
  await page.locator('input[name=lastname]').fill(lastname)
  await page.locator('input[name=streetAddress]').fill('1234')
  await page.locator('input[name=city]').fill('Paris')
  await page.locator('input[name=postalCode]').fill('75001')
  await page.locator('input[name=phoneNumber]').fill('0601020304')
  await page
    .locator('input[name=email]')
    .fill(`${firstname}-${lastname}@test.com`)
}

const assertIndexPageClients = async (page: Page): Promise<void> => {
  const divClients: Locator = page.locator('#index-client')
  await expect(divClients).toBeVisible({
    timeout: 60000,
  })
}
