import { describe } from 'node:test'
import { type Locator, type Page, expect, test } from '@playwright/test'
import { goToHome } from './helper/homeHelper'

interface Box {
  x: number
  y: number
  width: number
  height: number
}

describe('WorkEventDay test', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL as string)
    await goToHome(page)

    page.getByRole('link', { name: 'calendar Calendrier' }).click()

    await page.waitForSelector('#page-calendar-work-event-day', {
      state: 'visible',
      timeout: 60000,
    })
  })

  test('show calendar', async ({ page }) => {
    const date = new Date()
    const day = date.getDate()
    const dayMonth = day >= 15 ? 1 : 28

    await page
      .locator(
        `[data-year="${date.getFullYear()}"][data-month="${date.getMonth() + 1}"][data-day="${dayMonth}"]`,
      )
      .first()
      .click()

    expect(
      await page.getByText("Pas d'événement ce jour").first(),
    ).not.toBeNull()
  })

  test('Create WorkEventDay', async ({ page, defaultBrowserType }) => {
    page.getByTestId('open-modal-work-event-day').click()
    await page.waitForSelector('#form-calendar')

    const title: string = `Présation du jour ${defaultBrowserType}`
    const endHours: string = '18:00'
    await handleSumbitForm(page, title, endHours)
  })

  test('Update WorkEventDay', async ({ page, defaultBrowserType }) => {
    await handleSwipeout(page)
    await page.locator('.edit-event').first().click()

    await page.waitForSelector('#form-calendar')
    const title: string = `Présation du jour modification ${defaultBrowserType}`
    const endHours: string = '15:00'
    await handleSumbitForm(page, title, endHours)
    const box: Box | null = await getBoxSwipe(page)
    if (box) {
      await swipeDown(page, box)
    }
  })
})

const fillFormWorkEventDay = async (
  page: Page,
  title: string,
  endHours: string,
): Promise<void> => {
  await page.locator('input[name="title"]').fill(title)
  await page.locator('input[name="startHours"]').fill('08:00')
  await page.locator('input[name="endHours"]').fill(endHours)
}

const handleSumbitForm = async (
  page: Page,
  title: string,
  endHours: string,
): Promise<void> => {
  await fillFormWorkEventDay(page, title, endHours)
  await page.waitForSelector('#btn-send')
  await page.locator('#btn-send').click()

  await page.locator('.dialog-button').click()
  expect(await page.getByText(title).first()).not.toBeNull()
}

const handleSwipeout = async (page: Page): Promise<void> => {
  const box: Box | null = await getBoxSwipe(page)
  if (box) {
    await swipeDown(page, box)
    await swipeUp(page, box)
  }
}

const getBoxSwipe = async (page: Page): Promise<Box | null> => {
  const swipeItem: Locator = page.locator('li.swipeout').first()

  return await swipeItem.boundingBox()
}

const swipeDown = async (page: Page, box: Box) => {
  await page.mouse.move(box.x + box.width - 10, box.y + box.height / 2)
  await page.mouse.down()
}

const swipeUp = async (page: Page, box: Box): Promise<void> => {
  await page.mouse.move(box.x + 10, box.y + box.height / 2, { steps: 10 })
  await page.mouse.up()
}
