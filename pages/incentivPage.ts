import { Page, Locator, expect } from '@playwright/test';
import BasePage from './basePage';


export class LoginPage extends BasePage{
    constructor(page: Page){
        super(page)
    }


    async ConnectMetamask() {
        // Спочатку натискаємо кнопки на сайті
        await this.page.getByRole('button', { name: 'Reconnect here' }).click();
        await this.page.getByRole('button', { name: 'MetaMask' }).click();

        // Після натискання зазвичай з'являється поп-ап Metamask для підтвердження
        // Перехоплюємо це вікно
        const popup = await this.page.context().waitForEvent('page');
        await popup.waitForLoadState();

        // Натискаємо "Next" та "Connect" у поп-апі
        // Використовуємо TestID або текст, які є стандартними для Metamask
        await popup.getByRole('button', { name: 'Next' }).click().catch(() => {});
        await popup.getByRole('button', { name: 'Connect' }).click().catch(() => {});
    }


    async SendTransaction() {
        await this.page.getByRole('button', { name: 'Send', exact: true }).first().click();
        await this.page.getByRole('textbox', { name: 'Input amount' }).click();
        await this.page.getByRole('textbox', { name: 'Input amount' }).fill('0.01');
        await this.page.getByRole('textbox', { name: 'Search...' }).first().fill('0x7165e7fcc7e82815460635835784b5c71169b146');
        await this.page.getByRole('button', { name: 'Confirm' }).click();
    }


    async WaitForAlert() {
        const text = await this.page.locator("#Alert").textContent()
        return text
    }

}