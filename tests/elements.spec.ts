import { test, expect } from '@playwright/test';
import TextBoxPage from "../pages/TextBoxPage";
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
});
