import { describe } from 'node:test'
import { type Download, expect, test } from '@playwright/test'
import { goToHome } from './helper/homeHelper'

describe('WorkEventDay search test', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL as string)
    await goToHome(page)

    page.getByRole('link', { name: 'calendar Calendrier' }).click()

    await page.waitForSelector('#page-calendar-work-event-day', {
      state: 'visible',
      timeout: 60000,
    })
  })

  test('Search work event days and export PDF and Excel', async ({
    page,
    defaultBrowserType,
  }) => {
    const title = `Peinture recherche ${defaultBrowserType}`

    page.getByTestId('open-modal-work-event-day').click()
    await page.waitForSelector('#form-calendar')
    await page.locator('input[name="title"]').fill(title)
    await page.locator('input[name="startHours"]').fill('08:00')
    await page.locator('input[name="endHours"]').fill('18:00')
    await page.locator('#btn-send').click()
    await page.locator('.dialog-button').click()

    await page.getByTestId('open-search-work-event-day').click()
    await page.waitForSelector('#form-work-event-day-search', {
      state: 'visible',
      timeout: 60000,
    })

    await page
      .locator('#form-work-event-day-search input[name="search"]')
      .fill('^Peinture recherche')
    await page.getByTestId('submit-search-work-event-day').click()

    const resultCount = page.getByTestId('search-work-event-day-count')
    await expect(resultCount).toBeVisible()
    await expect(page.getByText(title)).toBeVisible()

    await page
      .locator('.popup-search-work-event-day select[name="export-format"]')
      .selectOption('xlsx')
    const [xlsxDownload] = await Promise.all<
      [Promise<Download>, Promise<void>]
    >([
      page.waitForEvent('download'),
      page.getByTestId('export-search-work-event-day').click(),
    ])
    expect(xlsxDownload.suggestedFilename()).toBe('prestations_recherche.xlsx')

    await page
      .locator('.popup-search-work-event-day select[name="export-format"]')
      .selectOption('pdf')
    const [pdfDownload] = await Promise.all<[Promise<Download>, Promise<void>]>(
      [
        page.waitForEvent('download'),
        page.getByTestId('export-search-work-event-day').click(),
      ],
    )
    expect(pdfDownload.suggestedFilename()).toBe('prestations_recherche.pdf')
  })
})
