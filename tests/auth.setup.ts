import { test, expect, type Page, type BrowserContext } from '@playwright/test'
import { goToHome } from './helper/homeHelper'

test('authenticate', async ({ baseURL, browser }) => {
  const context: BrowserContext = await browser.newContext({
    permissions: ['notifications'],
  })

  const page: Page = await context.newPage()
  await page.goto(baseURL as string)

  await expect(page).toHaveTitle(/Gestion Travaux/)

  await page.locator('input[name=username]').fill('user@test.com')
  await page.locator('input[name=password]').fill('1234')
  await page.getByTestId('link-login').click()

  await goToHome(page)

  await context.storageState({ path: 'tests/auth.json' })

  await context.close()
})
