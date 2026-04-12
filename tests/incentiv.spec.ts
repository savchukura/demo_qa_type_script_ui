// ВАЖЛИВО: Імпортуємо 'test' та 'expect' з вашої фікстури, а не з бібліотеки
import { test, expect } from './fixtures/metamaskFixture'; 
import { LoginPage } from '../pages/incentivPage.ts';
import { MetamaskExt } from '../pages/metamaskPage.ts';

test.describe('Connect', async () => {
  let loginPage: LoginPage
  let metamaskExt: MetamaskExt
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    metamaskExt = new MetamaskExt(page)
    await page.goto('https://portal.incentiv.io/login');
    
  });

  test('Connect Metamask', async () => {
    
    await metamaskExt.unlockMetamask('213456qaZ');
    await loginPage.SendTransaction();
    await metamaskExt.confirmInMetamask();
    const result = await loginPage.WaitForAlert();
    expect(result).toEqual('Send Transaction')
  });
});