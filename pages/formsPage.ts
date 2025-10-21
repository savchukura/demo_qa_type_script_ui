import { Page, Locator, expect } from '@playwright/test';
import BasePage from './basePage';
import {generateTxtFile, deleteFile} from '../utils/dataGenerator'
import * as fs from 'fs';
import * as path from 'path';


export class FormsPage extends BasePage{

    private readonly resultTable: Locator

    constructor(page: Page){
        super(page)
        this.resultTable = page.locator('.table-responsive').locator('tr')

    }

    async CreatePerson(firstName: string, lastName: string, email: string, mobileNumber: string, currentAddress: string){
        await this.selectSubject()
        await this.fillAllInputs(firstName, lastName, email, mobileNumber, currentAddress)
        await this.selectGender()
        await this.selectHobbies()
        await this.UploadFile('test')
        
        
        await this.selectState()
        
        await this.page.getByRole('button', {name: 'Submit'}).click()

    }

    async fillAllInputs(firstName: string, lastName: string, email: string, mobileNumber: string, currentAddress: string){
        await this.page.getByPlaceholder("First Name").fill(firstName)
        await this.page.getByPlaceholder("Last Name").fill(lastName)
        await this.page.getByPlaceholder('name@example.com').fill(email)
        await this.page.getByPlaceholder('Mobile Number').fill(mobileNumber)
        await this.page.locator('#dateOfBirthInput').fill('22 Apr 1994')
        await this.page.locator('#dateOfBirthInput').press('Enter');
        await this.page.getByPlaceholder('Current Address').fill(currentAddress)
        
    }

    async selectSubject(){
        await this.page.locator('#subjectsInput').fill('Maths');
        await this.page.locator('#subjectsInput').press('ArrowDown');
        await this.page.locator('#subjectsInput').press('Enter');
    }

    async selectGender(){
        const gendersOptions = ['male', 'female', 'other'] as const;
        const genders = gendersOptions[Math.floor(Math.random() * gendersOptions.length)];
        if(genders === 'male'){
            await this.page.getByText('Male', { exact: true }).click();
        }
        else if(genders === 'female'){
            await this.page.getByText('Female').click();
        }
        else if(genders === 'other'){
            await this.page.getByText('Other').click();
        }
    }

    async selectHobbies(){
        await this.page.getByText('Sports').click();
        await this.page.getByText('Reading').click();
        await this.page.locator('div').filter({ hasText: /^Music$/ }).click();
    }

    async UploadFile(fileName: string){
        const filePath = generateTxtFile(fileName, 'Test Content');
        await this.page.setInputFiles('input[type="file"]', filePath);
        deleteFile(filePath);
    }

    async selectState(){
        await this.page.getByText('Select State').click()
        await this.page.getByText('Uttar Pradesh', { exact: true }).click();
        await this.page.getByText('Select City').click();
        await this.page.getByText('Lucknow', { exact: true }).click();
    }

    async getResults(){
        
        //const result = await this.resultTable.locator('tr').nth(2).locator('td').nth(1).textContent()
        const resultCount = await this.resultTable.count()
        const results: string[] = [];
        for(let i = 1; i < resultCount; i++ ){
            const text = await this.resultTable.nth(i).locator('td').nth(1).textContent()
            results.push(text?.trim() || '')
        }
        return results
    }
}