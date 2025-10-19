import { Page, Locator, expect } from '@playwright/test';
import BasePage from './basePage';
import {generateTxtFile, deleteFile} from '../utils/dataGenerator'
import * as fs from 'fs';
import * as path from 'path';


export class TextBoxPage extends BasePage {
    private readonly FullNameInput: Locator;
    private readonly EmailInput: Locator
    private readonly CurrentAddressInput: Locator;
    private readonly PermanentAddressInput: Locator
    private readonly SubmitButton: Locator;
    private readonly OutputName: Locator
    private readonly OutputEmail: Locator
    private readonly OutputCurrentAddress: Locator
    private readonly OutputPermanentAddress: Locator
    
    constructor(page: Page) {
        super(page)
        this.FullNameInput = page.locator('#userName');
        this.EmailInput = page.locator('#userEmail');
        this.CurrentAddressInput = page.locator('#currentAddress');
        this.PermanentAddressInput = page.locator('#permanentAddress');
        this.SubmitButton = page.locator('#submit');
        this.OutputName = page.locator('#output #name');
        this.OutputEmail = page.locator('#output #email');
        this.OutputCurrentAddress = page.locator('#output #currentAddress');
        this.OutputPermanentAddress = page.locator('#output #permanentAddress');
    }
        
    async fillAllFields(fullName: string, email: string, currentAddress: string, permanentAddress: string) {
        await this.FullNameInput.fill(fullName);
        await this.EmailInput.fill(email);
        await this.CurrentAddressInput.fill(currentAddress);
        await this.PermanentAddressInput.fill(permanentAddress);
    }

    async clickSubmitButton() {
        await this.SubmitButton.click();
    }

    async checkResults() {
        await this.page.waitForSelector('#output', { state: 'visible' });
        const nameText = await this.OutputName.innerText();
        const emailText = await this.OutputEmail.innerText();
        const currentAddressText = await this.OutputCurrentAddress.innerText();
        const permanentAddressText = await this.OutputPermanentAddress.innerText();
        const name = nameText.replace('Name:', '').trim();
        const email = emailText.replace('Email:', '').trim();
        const currentAddress = currentAddressText.replace('Current Address :', '').trim();
        const permanentAddress = permanentAddressText.replace('Permananet Address :', '').trim();
        return { name, email, currentAddress, permanentAddress};
    }
}


export class CheckBoxPage extends BasePage {

    constructor(page: Page){
        super(page)
    }


    async clickCheckBoxes(){
        await this.page.getByRole('button', { name: 'Expand all' }).click()
        await this.page.locator('label').filter({ hasText: 'Word File.doc' }).getByRole('img').first().click()
    }

    async selectGroupOfCheckboxes(){
        await this.page.getByRole('button', { name: 'Expand all' }).click()
        await this.page.locator('label').filter({ hasText: 'Office' }).getByRole('img').first().click();
    }

    async getResult(){
        const result = await this.page.locator('#result').locator('.text-success').textContent()
        return result
    }

    async getResults() {
        const resultsLocator = this.page.locator('#result .text-success');
        const resultsCount = await resultsLocator.count();

        const results: string[] = [];

        for (let i = 0; i < resultsCount; i++) {
            const text = await resultsLocator.nth(i).innerText();
            results.push(text.trim());
        }

        return results;
    }
}


export class RadioButtonPage extends BasePage {

    constructor(page: Page){
        super(page)
    }

    async clickOnRadioButton(radioButton: 'yes' | 'impressive' | 'no'): Promise<void> {

    const radioButtons: Record<'yes' | 'impressive' | 'no', string> = {
      yes: 'yes',
      impressive: 'impressive',
      no: 'no',
    };

    await this.page.getByText(radioButtons[radioButton]).click();
  }

    async getRadioResults(){
        
        const result = await this.page.locator('.text-success').textContent()
        return result?.toLowerCase()
    }

}


export class WebTablesPage extends BasePage{
    constructor(page: Page){
        super(page)
    }

    async clickAddButton(){
        await this.page.getByRole('button', { name: 'Add' }).click()
    }

    async clickEditButton(){
        await this.page.locator("span[title='Edit']").click()
    }

    async createPerson(firstName: string, lastName: string, email: string, age: string, salary: string, department: string){
        await this.page.getByPlaceholder('First Name').fill(firstName)
        await this.page.getByPlaceholder('Last Name').fill(lastName)
        await this.page.getByPlaceholder('name@example.com').fill(email)
        await this.page.getByPlaceholder('Age').fill(age)
        await this.page.getByPlaceholder('Salary').fill(salary)
        await this.page.getByPlaceholder('Department').fill(department)
        await this.page.getByRole('button', { name: 'Submit' }).click()
    }

    async search(search: string){
        await this.page.getByPlaceholder('Type to search').fill(search)
    }

    async deletePerson(){
        await this.page.locator("span[title='Delete']").click()
    }

    async checkDeleteResult(){
        const no_result_message = await this.page.locator("div[class='rt-noData']").textContent()
        return no_result_message
    }

    async getResults(){
        const person = this.page.locator(".rt-tr-group").first()
        const firstName = await person.locator(".rt-td").nth(0).textContent()
        const lastName = await person.locator(".rt-td").nth(1).textContent()
        const email = await person.locator(".rt-td").nth(3).textContent()
        const age = await person.locator(".rt-td").nth(2).textContent()
        const salary = await person.locator(".rt-td").nth(4).textContent()
        const department = await person.locator(".rt-td").nth(5).textContent()
        return {firstName, lastName, email, age, salary, department}
    }
}


export class ButtonsPage extends BasePage {
    constructor(page: Page){
        super(page)
    }

    async clickDoubleClickButton(){
        await this.page.getByRole('button', {name: 'Double Click Me'}).dblclick()
        const result = await this.page.locator("#doubleClickMessage").textContent()
        return result
    }

    async clickRightClickButton(){
        await this.page.getByRole('button', {name: 'Right Click Me'}).click({ button: 'right' })
        const result = await this.page.locator("#rightClickMessage").textContent()
        return result
    }

    async clickMeButton(){
        await this.page.getByRole('button', { name: 'Click Me', exact: true }).click()
        const result = await this.page.locator("#dynamicClickMessage").textContent()
        return result
    }

    async getResult(){
        const result = await this.page.locator("#doubleClickMessage")
    }
}


export class DownloadUploadPage extends BasePage{
    constructor(page: Page){
        super(page)
    }

    async UploadFile(fileName: string){
        const filePath = generateTxtFile(fileName, 'Test Content');

        await this.page.setInputFiles('input[type="file"]', filePath);

        await expect(this.page.locator('#uploadedFilePath')).toBeVisible();

        deleteFile(filePath);
    }

    async getUploadedFileText(){
        const result = await this.page.locator('#uploadedFilePath').textContent()
        return result?.split(/[/\\]/).pop()?.replace('.txt', '');
    }

    async downloadFile(){
        const href = await this.page.locator('#downloadButton').getAttribute('href');
        if (!href) throw new Error('Download link not found');

        const base64Data = href.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        const randomId = Math.floor(Math.random() * 1000);
        const filePath = path.resolve(__dirname, `../testData/downloaded_${randomId}.jpeg`);

        fs.writeFileSync(filePath, buffer);

        const fileExists = fs.existsSync(filePath);

        fs.unlinkSync(filePath);

        return fileExists;
    }
}

export class DynamicPropertiesPage extends BasePage {
    EnableButton: Locator
    VisibleButton: Locator

    constructor(page: Page){
        super(page)
        this.EnableButton = page.locator('#enableAfter')
        this.VisibleButton = page.locator('#visibleAfter')
    }

    async clickEnableButton(){
        return this.EnableButton;
    }

    async getCollorBefore(){
        const colorBefore = this.page.locator('#colorChange').evaluate((element) => {
            return getComputedStyle(element).color;
    })
    return colorBefore
    }

    async getCollorAfter(){
        await this.page.waitForTimeout(6000)
        const colorAfter = this.page.locator('#colorChange').evaluate((element) => {
            return getComputedStyle(element).color;
    })
    return colorAfter
    }

    async clickVisibleButton(){
        return this.VisibleButton
    }

}