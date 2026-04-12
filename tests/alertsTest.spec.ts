import { test, expect } from '@playwright/test';
import { generateUserData } from '../utils/dataGenerator';
import{ BrowserWindowPage, AlertsPage, FramesPage, NestedFramesPage, ModalDialogsPage } from '../pages/alertsPage'
import {LargeModalText} from '../testData/resultData'


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


test.describe('Frame page Tests', () =>{

    test.beforeEach(async ({page}) => {
        await page.goto('/frames')
    })

    test('check First Frame', async ({page}) => {
        const framePage = new FramesPage(page)
        const result = await framePage.getFirstFrame()
        expect(result).toEqual('This is a sample page')
    })

    test('check Second Frame', async ({page}) => {
        const framePage = new FramesPage(page)
        const result = await framePage.getSecondFrame()
        expect(result).toEqual('This is a sample page')
    })
         
})

test.describe('Neted Frames Tests', () =>{

    let NestedPage: NestedFramesPage;

    test.beforeEach(async ({page}) =>{
        await page.goto('/nestedframes')
        NestedPage = new NestedFramesPage(page);
    })

    test('Get Parent Frame text', async () => {
        const text = await NestedPage.getPareentFrame()
        expect(text).toEqual('Parent frame')
    })

    test('Get Child Frame text', async () => {
        const text = await NestedPage.getChildFrame()
        expect(text).toEqual('Child Iframe')
    })
})


test.describe('Modal Dialogs Page Tests', () =>{

    let modalPage: ModalDialogsPage;

    test.beforeEach(async ({page}) =>{
        await page.goto('/modal-dialogs')
        modalPage = new ModalDialogsPage(page);
    })

    test('get small modal text', async () =>{
        await modalPage.clickModalButtons('small')
        const text = await modalPage.getModalText()
        expect(text).toEqual('Small Modal')
    })

    test('get large modal text', async ({page}) =>{
        await modalPage.clickModalButtons('large')
        const text = await modalPage.getModalText()
        await page.screenshot({path: 'screnshots/largeModalScreen.png'})
        expect(text).toEqual(LargeModalText)
    })
})