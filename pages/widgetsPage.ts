import BasePage from './basePage'
import { Page, Locator, expect } from '@playwright/test';


export class AccordianPage extends BasePage {
    constructor(page: Page){
        super(page)
    }

    async clickAccordianTab(button: string) {
        const accordian_buttons: Record<string, string> = {
            "1": "#section1Heading",
            "2": "#section2Heading",
            "3": "#section3Heading"
        }
        await this.page.locator(accordian_buttons[button]).click()
    }

    async getText(TextArea: string) {
        const accordianTextArea: Record<string, string> = {
            "1": "#section1Content",
            "2": "#section2Content",
            "3": "#section3Content"
        }
        const text = await this.page.locator(accordianTextArea[TextArea]).textContent()
        return text
    }
}