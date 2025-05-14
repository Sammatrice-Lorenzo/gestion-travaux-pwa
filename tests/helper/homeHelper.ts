import { expect, Locator, Page } from '@playwright/test'

const goToHome = async (page: Page): Promise<void> => {
    const titlePageWork: Locator = page.locator('#title-work')
    await expect(titlePageWork).toBeVisible({
        timeout: 10000
    })
}

export {
    goToHome
}