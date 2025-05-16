import { expect, type Locator, type Page } from '@playwright/test'

const goToHome = async (page: Page): Promise<void> => {
  const titlePageWork: Locator = page.locator('#title-work')
  await expect(titlePageWork).toBeVisible({
    timeout: 30000,
  })
}

export { goToHome }
