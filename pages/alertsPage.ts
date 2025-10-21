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