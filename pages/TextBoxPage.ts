import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';


export default class TextBoxPage extends BasePage {
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
        super(page);
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