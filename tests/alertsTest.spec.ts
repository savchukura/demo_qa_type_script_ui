import { test, expect } from '@playwright/test';
import { generateUserData } from '../utils/dataGenerator';
import{ BrowserWindowPage } from '../pages/alertsPage'


test.describe('Browser Window page Test', () => {

    test.beforeEach( async ({page}) => {
        await page.goto('/browser-windows')
    })

    test('test New Tab button', async ({page}) => {
        const browserPage = new BrowserWindowPage(page)
        const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
            browserPage.clickBrowserButton('new tab'),
        ]);
        await newPage.waitForLoadState();
        expect(newPage.url()).toContain('sample')
        await expect(newPage.locator('h1')).toHaveText('This is a sample page');
    })

    test('test New Window button', async ({page}) => {
        const browserPage = new BrowserWindowPage(page)
        const [newWindow] = await Promise.all([
            page.context().waitForEvent('page'),
            browserPage.clickBrowserButton('new window')
        ])
        await newWindow.waitForLoadState()
        expect(newWindow.url()).toContain('sample')
        await expect(newWindow.locator('h1')).toHaveText('This is a sample page')
    })

    test('test New Window Message button', async ({page}) => {
        const browserPage = new BrowserWindowPage(page)
        const [newWindow] = await Promise.all([
            page.context().waitForEvent('page'),
            browserPage.clickBrowserButton('new window message')
        ])
        await newWindow.waitForLoadState()
        await expect(newWindow.locator('body')).toHaveText('Knowledge increases by sharing but not by saving. Please share this website with your friends and in your organization.')
    })
})