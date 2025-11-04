import { test, expect } from '@playwright/test';
import{ AccordianPage } from '../pages/widgetsPage'


test.describe('Accordian page test', () => {

    let accordianPage: AccordianPage

    test.beforeEach(async ({page}) =>{
        await page.goto('/accordian')
        accordianPage = new AccordianPage(page)
    })

    test('get first tab text', async () =>{
        await accordianPage.clickAccordianTab('1')
        const text = await accordianPage.getText('1')
        expect(text).toContain('It was popularised in the 1960s')
    })

    test('get second tab text', async () =>{
        await accordianPage.clickAccordianTab('2')
        const text = await accordianPage.getText('2')
        expect(text).toContain('Lorem Ipsum comes from sections 1.10.32 and 1.10.33 ')
    })

    test('get third tab text', async () =>{
        await accordianPage.clickAccordianTab('3')
        const text = await accordianPage.getText('3')
        expect(text).toContain('The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters')
    })
})