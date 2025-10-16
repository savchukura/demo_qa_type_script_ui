import { test, expect } from '@playwright/test';
import { TextBoxPage, CheckBoxPage, RadioButtonPage, WebTablesPage } from '../pages/elementsPage.ts'
import { generateUserData } from '../utils/dataGenerator';

const testDataArray = [
  generateUserData(),
  generateUserData(),
  generateUserData(),
];


test.describe('Text Box Page Tests', () => {
  let textBoxPage: TextBoxPage;

  test.beforeEach(async ({ page }) => {
    textBoxPage = new TextBoxPage(page);
    await textBoxPage.open('https://demoqa.com/text-box');

  });

  for (const [index, testData] of testDataArray.entries()) {
    test(`Fill and submit form (dataset #${index + 1})`, async () => {
      await textBoxPage.fillAllFields(
        testData.fullName,
        testData.email,
        testData.currentAddress,
        testData.permanentAddress
      );
      await textBoxPage.clickSubmitButton();

      const results = await textBoxPage.checkResults();

      expect(results.name).toBe(testData.fullName);
      expect(results.email).toBe(testData.email);
      expect(results.currentAddress).toBe(testData.currentAddress);
      expect(results.permanentAddress).toBe(testData.permanentAddress);
    });
  }

  test('Leave input fields empty and submit form', async () => {
    const testData = generateUserData();
    await textBoxPage.fillAllFields(
        testData.fullName,
        testData.email,
        testData.currentAddress,
        testData.permanentAddress
      );
      await textBoxPage.clickSubmitButton();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
})


test.describe('CheckBoxPage', async () => {

  test.beforeEach(async ({page}) => {
    await page.goto('https://demoqa.com/checkbox')
  })

  test('Click Some Check Box', async ({page}) => {
    const checkBoxPage = new CheckBoxPage(page)

    await checkBoxPage.clickCheckBoxes()
    const result = await checkBoxPage.getResult()

    expect(result).toEqual('wordFile')
    
  })

  test('Click Group of Check Boxes', async ({page}) => {
    const checkBoxPage = new CheckBoxPage(page)

    await checkBoxPage.selectGroupOfCheckboxes()
    const result = await checkBoxPage.getResults()

    expect(result).toEqual([ 'office', 'public', 'private', 'classified', 'general' ])
    
  })

})


test.describe(' Radio Button Page Tests', () => {
  
  test.beforeEach( async ({page}) => {
    await page.goto('https://demoqa.com/radio-button')
  })

  test('Click Yes Radio', async ({page}) => {
    const radioPage = new RadioButtonPage(page);
    const radioOptions = ['yes', 'impressive'] as const;
    const randomRadio = radioOptions[Math.floor(Math.random() * radioOptions.length)];

    await radioPage.clickOnRadioButton(randomRadio);
    
    const result = await radioPage.getRadioResults();

    expect(result).toBe(randomRadio);
  })

})


test.describe('Web Tables Page', () => {
  
  test.beforeEach( async ({page}) => {
    await page.goto('https://demoqa.com/webtables')
  })

  test('Create Person', async ({page}) => {
    const person = generateUserData()
    const webTables = new WebTablesPage(page)
    await webTables.clickAddButton()
    await webTables.createPerson(person.firstName, person.lastName, person.email, person.age, person.salary, person.department)
    await webTables.search(person.firstName)
    const results = await webTables.getResults()
    expect(results.firstName).toEqual(person.firstName)
    expect(results.lastName).toEqual(person.lastName)
    expect(results.email).toEqual(person.email)
    expect(results.age).toEqual(person.age)
    expect(results.salary).toEqual(person.salary)
    expect(results.department).toEqual(person.department)
    
  })

  test('Edit Person', async ({page}) => {
    const person = generateUserData()
    const ePerson = generateUserData()

    const webTables = new WebTablesPage(page)

    await webTables.clickAddButton()
    await webTables.createPerson(person.firstName, person.lastName, person.email, person.age, person.salary, person.department)
    await webTables.search(person.firstName)
 
    await webTables.clickEditButton()
    await webTables.createPerson(ePerson.firstName, ePerson.lastName, ePerson.email, ePerson.age, ePerson.salary, ePerson.department)
    await webTables.search(ePerson.firstName)

    const results = await webTables.getResults()

    expect(results.firstName).toEqual(ePerson.firstName)
    expect(results.lastName).toEqual(ePerson.lastName)
    expect(results.email).toEqual(ePerson.email)
    expect(results.age).toEqual(ePerson.age)
    expect(results.salary).toEqual(ePerson.salary)
    expect(results.department).toEqual(ePerson.department)
  })

  test('Delete Person', async ({page}) => {
    const person = generateUserData()
    const webTables = new WebTablesPage(page)
    await webTables.clickAddButton()
    await webTables.createPerson(person.firstName, person.lastName, person.email, person.age, person.salary, person.department)
    await webTables.search(person.firstName)
    await webTables.deletePerson()
    const result = await webTables.checkDeleteResult()
    expect(result).toEqual('No rows found')
  })

})