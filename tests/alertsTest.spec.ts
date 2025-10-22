import { test, expect } from '@playwright/test';
import { generateUserData } from '../utils/dataGenerator';
import{ BrowserWindowPage, AlertsPage } from '../pages/alertsPage'


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


test.describe('Alerts Page Tests', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/alerts')
    })

    test(' check alert button', async ({page}) =>{
        let alertMessageText: string | null = null;

        page.on('dialog', async (dialog) => {
            alertMessageText = dialog.message();
            await dialog.accept();
        });

        const alertsPage = new AlertsPage(page)
        await alertsPage.clickAlertButton('1')
        expect(alertMessageText).toBe('You clicked a button');
    })

    test(' check wait 5 second alert button', async ({page}) =>{
        const alertsPage = new AlertsPage(page);
        const dialogPromise = page.waitForEvent('dialog');
        await alertsPage.clickAlertButton('2');
        const dialog = await dialogPromise;
        expect(dialog.message()).toBe('This alert appeared after 5 seconds');
        await dialog.accept();
    })
    test(' check confirm box button, Select OK', async ({page}) =>{
        let alertMessageText: string | null = null;
        page.on('dialog', async (dialog) => {
            alertMessageText = dialog.message();
            await dialog.accept();
        });
        const alertsPage = new AlertsPage(page)
        await alertsPage.clickAlertButton('3')
        const result = await alertsPage.getResult()
        expect(alertMessageText).toBe('Do you confirm action?');
        expect(result).toEqual('You selected Ok')
    })

    test(' check confirm box button, Select Cancel', async ({page}) =>{
        let alertMessageText: string | null = null;
        page.on('dialog', async (dialog) => {
            alertMessageText = dialog.message();
            await dialog.dismiss();
        });
        const alertsPage = new AlertsPage(page)
        await alertsPage.clickAlertButton('3')
        const result = await alertsPage.getResult()
        expect(alertMessageText).toBe('Do you confirm action?');
        expect(result).toEqual('You selected Cancel')
    })

    test(' check prompt box button, Select OK', async ({page}) =>{
        let alertMessageText: string | null = null;
        const text = 'tetriandoh'
        page.on('dialog', async (dialog) => {
            alertMessageText = dialog.message();
            await dialog.accept(text);
        });
        const alertsPage = new AlertsPage(page)
        await alertsPage.clickAlertButton('4')
        const result = await alertsPage.getPromptResult()
        expect(alertMessageText).toBe('Please enter your name');
        expect(result).toEqual(`You entered ${text}`)
    })

})