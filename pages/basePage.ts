// pages/BasePage.ts
import { Page, expect } from '@playwright/test';

export default abstract class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open(url: string) {
        await this.page.goto(url);
    }
}