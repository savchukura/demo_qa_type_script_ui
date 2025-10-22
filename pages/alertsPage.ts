import { Page, Locator, expect } from '@playwright/test';
import BasePage from './basePage';
import {generateTxtFile, deleteFile} from '../utils/dataGenerator'


export class BrowserWindowPage extends BasePage{
    constructor(page: Page){
        super(page)
    }

    async clickBrowserButton(browserButton: string){
        const button = browserButton
        if (button === 'new tab'){
            await this.page.getByRole('button', {name: 'New Tab'}).click()
        }
        else if (button === 'new window'){
            await this.page.getByRole('button', {name: 'New Window', exact: true}).click()
        }
        else if (button === 'new window message'){
            await this.page.getByRole('button', {name: 'New Window Message', exact: true}).click()
        }
        else{
            console.log('invalid button')
        }
    }
}


export class AlertsPage extends BasePage {
    constructor(page: Page){
        super(page)
    }

    async clickAlertButton(button: string) {
    const alert_buttons: Record<string, string> = {
        "1": "#alertButton",
        "2": "#timerAlertButton",
        "3": "#confirmButton",
        "4": "#promtButton"
    }

    await this.page.locator(alert_buttons[button]).click()
}

    async getResult(){
        const result = await this.page.locator('#confirmResult').textContent()
        return result
    }

    async getPromptResult(){
        const result = await this.page.locator('#promptResult').textContent()
        return result
    }
}