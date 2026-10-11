import { describe } from 'node:test'
import { type Locator, type Page, expect, test } from '@playwright/test'
import { ProgressionEnum } from '../src/js/enum/ProgressionEnum'
import { goToHome } from './helper/homeHelper'

describe('Work test', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL as string)
    await goToHome(page)
  })

  test('show work', async ({ page }) => {
    await handleClickFirstCard(page)

    const divShowWork: Locator = page.locator('#show-work')
    await expect(divShowWork).toBeVisible({
      timeout: 10000,
    })

    await assertModalSheetWorkImage(page)
  })

  test('Create Work', async ({ page, defaultBrowserType }) => {
    page.getByText('Ajouter').click()
    await page.waitForSelector('#form-work')

    const name: string = `Changement Ballon ${defaultBrowserType}`
    await submitForm(page, name)
  })

  test('Update Work', async ({ page, defaultBrowserType }) => {
    await handleClickFirstCard(page)
    await page.waitForSelector('#form-work-edit')
    await page.locator('#form-work-edit').click()
    await page.waitForSelector('#form-work')
    // initForm() fills the form asynchronously on pageBeforeIn: wait for it,
    // otherwise it overwrites the values typed by the test.
    await expect(page.locator('input[name=name]')).not.toHaveValue('')

    const name: string = `Update Changement Ballon ${defaultBrowserType}`
    await submitForm(page, name)
  })
})

const handleClickFirstCard = async (page: Page) => {
  const workCard: Locator = page.locator('.card').first()
  await workCard.getByRole('link').click()
}

const fillFormWork = async (page: Page, name: string) => {
  const now = new Date()
  now.setHours(8, 0)
  const start = now.toISOString().slice(0, 16)

  now.setHours(17, 30)
  const end = now.toISOString().slice(0, 16)

  await page.locator('input[name=name]').fill(name)
  await page.locator('input[name=city]').fill('Paris')
  await page
    .locator('select[name=progression]')
    .selectOption(ProgressionEnum.IN_PROGRESS)
  await page.locator('input[name=start]').fill(start)
  await page.locator('input[name=end]').fill(end)
  await page.locator('input[name=equipements]').fill('Ballon eau chaude')
  await page.locator('input[name=totalAmount]').fill('150.50')
}

const submitForm = async (page: Page, name: string) => {
  await fillFormWork(page, name)
  await page.getByRole('button').click()

  await page.locator('.dialog-button').click()
  await page.waitForSelector(`text="${name}"`)

  await page.waitForSelector(`text=${name}`, { timeout: 5000 })
  const element = page.getByText(name, { exact: true })
  await expect(element).toBeVisible()
}

const assertModalSheetWorkImage = async (page: Page) => {
  await page.locator('#work-actions').click()

  await page.getByText('Ajouter des images').click()

  await expect(await page.locator('.modal-in')).toBeVisible({
    timeout: 10000,
  })

  const sendButton: Locator = page.locator('#btn-send-form-work-images')

  // Without file: Zod validation shows an error toast
  await sendButton.click()
  await expect(page.locator('.toast')).toBeVisible({
    timeout: 10000,
  })

  const fileInput: Locator = page.locator('input[type="file"]')
  await fileInput.setInputFiles({
    name: 'work-image.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64',
    ),
  })

  // With file: upload succeeds and shows the success dialog
  await sendButton.click()
  await expect(page.locator('.dialog')).toContainText(
    "L'insertion a été bien prise en compte!",
    { timeout: 10000 },
  )
}
