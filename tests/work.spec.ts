import { expect, type Locator, test } from '@playwright/test'
import { describe } from 'node:test'
import { goToHome } from './helper/homeHelper'

describe('Work test', () => {
  test('show work', async ({ page, baseURL }) => {
    await page.goto(baseURL as string)
    await goToHome(page)
    const workCard: Locator = await page.locator('.card').first()
    workCard.getByRole('link').click()

    const divShowWork: Locator = page.locator('#show-work')
    await expect(divShowWork).toBeVisible({
      timeout: 10000,
    })
  })
})
