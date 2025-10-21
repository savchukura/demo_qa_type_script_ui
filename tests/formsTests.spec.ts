import { test, expect } from '@playwright/test';
import { generateUserData} from '../utils/dataGenerator';
import{ FormsPage } from '../pages/formsPage'


test.describe('Forms Page Tests', () =>{
    test.beforeEach(async ({page}) => {
        await page.goto('/automation-practice-form')
    })
    
    test('Create Person valid data', async ({page}) =>{
        const formsPage = new FormsPage(page)
        const uD = generateUserData()
        await formsPage.CreatePerson(uD.firstName, uD.lastName, uD.email, uD.mobileNumber, uD.currentAddress)
        const result = await formsPage.getResults()
        expect(uD.firstName + ' ' + uD.lastName).toEqual(result[0])
        expect(uD.email).toEqual(result[1])
        expect(uD.mobileNumber).toEqual(result[3])
        expect(uD.currentAddress).toEqual(result[8])
    })
})