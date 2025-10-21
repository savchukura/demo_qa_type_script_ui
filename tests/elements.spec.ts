import { test, expect } from '@playwright/test';
import { TextBoxPage, CheckBoxPage, RadioButtonPage, WebTablesPage, ButtonsPage, DownloadUploadPage, DynamicPropertiesPage } from '../pages/elementsPage.ts'
import { generateUserData} from '../utils/dataGenerator';

const testDataArray = [
  generateUserData(),
  generateUserData(),
  generateUserData(),
];


test.describe('Text Box Page Tests', () => {
  let textBoxPage: TextBoxPage;

  test.beforeEach(async ({ page }) => {
    textBoxPage = new TextBoxPage(page);
    await textBoxPage.open('/text-box');

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
    await page.goto('/checkbox')
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
    await page.goto('/radio-button')
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
    await page.goto('/webtables')
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


test.describe('Tests Buttons Page', () => {

  test.beforeEach( async ({page}) => {
    await page.goto('/buttons')
  })

  test('Test Click Double Click Button', async ({page}) => {
    const buttonsPage = new ButtonsPage(page)
    const result = await buttonsPage.clickDoubleClickButton()
    expect(result).toEqual('You have done a double click')
  })

  test('Test Right Click Button', async ({page}) => {
    const buttonsPage = new ButtonsPage(page)
    const result = await buttonsPage.clickRightClickButton()
    expect(result).toEqual('You have done a right click')

  })

  test('Test Dynamic Click Button', async ({page}) => {
    const buttonsPage = new ButtonsPage(page)
    const result = await buttonsPage.clickMeButton()
    expect(result).toEqual('You have done a dynamic click')

  })
})


test.describe('Work with Files', () => {

  test.beforeEach(async ({page}) => {
    await page.goto('/upload-download')
  })

  test('Upload File', async ({page}) => {
    const fileName = generateUserData().fileName
    const uploadFile = new DownloadUploadPage(page)
    await uploadFile.UploadFile(fileName)
    const result = await uploadFile.getUploadedFileText()
    expect(fileName).toEqual(result)
  })

  test('download File', async ({page}) => {
    const downloadFile = new DownloadUploadPage(page)
    expect(downloadFile).toBeTruthy();
  })
})


test.describe('Dynamic Properties Page Test', () =>{

  test.beforeEach(async ({page}) =>{
    await page.goto('/dynamic-properties')
  })

  test('Click "Enable after 5 seconds button"', async ({page}) =>{
    const dynamicPage = new DynamicPropertiesPage(page)
    const button = await dynamicPage.clickEnableButton()
    await expect(button).toBeEnabled({ timeout: 10000 })
  })

  test('Click "Collor Change button"', async ({page}) =>{
    const dynamicPage = new DynamicPropertiesPage(page)
    const colorBefore = await dynamicPage.getCollorBefore()
    const colorAfter = await dynamicPage.getCollorAfter()
    expect(colorBefore).not.toEqual(colorAfter)
  })

  test('Click "visible after 5 second button', async ({page}) =>{
    const dynamicPage = new DynamicPropertiesPage(page)
    const visibleButton = await dynamicPage.clickVisibleButton()
    await expect(visibleButton).toBeVisible()
  })
})