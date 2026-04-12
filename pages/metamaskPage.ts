import { Page, Locator, expect } from '@playwright/test';
import BasePage from './basePage';


export class MetamaskExt extends BasePage{
    constructor(page: Page){
        super(page)
    }


    async unlockMetamask(password: string) {
    const context = this.page.context();
    
    // Автоматично шукаємо ID розширення серед фонових процесів
    let [background] = context.serviceWorkers();
    if (!background) {
        background = await context.waitForEvent('serviceworker');
    }
    
    // Отримуємо ID з URL сервіс-воркера
    const extensionId = background.url().split('/')[2];
    const metamaskHome = `chrome-extension://${extensionId}/home.html`;

    const metamaskPage = await context.newPage();
    
    // Додаємо спроби (retry), якщо розширення ще не "прокинулося"
    await expect(async () => {
        await metamaskPage.goto(metamaskHome);
        await expect(metamaskPage).toHaveURL(new RegExp(extensionId));
    }).toPass({ timeout: 10000 });

    const passwordInput = metamaskPage.locator('#password');
    await this.page.waitForTimeout(5000);
    
    if (await passwordInput.isVisible({ timeout: 5000 })) {
        await passwordInput.fill(password);
        // Використовуємо більш надійний селектор для кнопки Unlock
        await metamaskPage.locator('button[data-testid="unlock-submit"]').click();
        
        // Чекаємо, поки з'явиться головний екран MetaMask (Portfolio/Assets)
        await expect(passwordInput).not.toBeVisible();
    }
    
    await metamaskPage.close();
}


    async confirmInMetamask() {
    // 1. Чекаємо на появу вікна MetaMask
    const popup = await this.page.context().waitForEvent('page');
    
    // 2. Знаходимо кнопку за текстом або TestID і натискаємо
    // Playwright сам почекає появи кнопки, тому waitForLoadState зазвичай не потрібен
    await popup.getByRole('button', { name: 'Confirm' }).click();
}

}