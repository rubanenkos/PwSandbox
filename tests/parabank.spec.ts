
  
  import { test, BrowserContext, Page, expect } from '@playwright/test';
  import {SessionCache} from "../src/session"
  
  const sessionCache = SessionCache.getInstance();

  test.describe('ParaBANK tests', () => {
    let context: BrowserContext;
    let page: Page;
  
    test.beforeAll(async ({ browser }) => {
      // Check if the session is already stored
      const session = sessionCache.getSession();
  
      if (session) {
        // Use the stored session
        context = await browser.newContext(session);
        console.log('Use stored session');
        
      } else {
        // Perform the login step and store the session
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://parabank.parasoft.com/parabank/index.htm');
        await page.locator('input[name="username"]').fill('bobdilan');
        await page.locator('input[name="username"]').press('Tab');
        await page.locator('input[name="password"]').fill('Bobdilan@123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await page.waitForLoadState('networkidle')
        // Store the session in the cache
        const newSession = await context.storageState();
        sessionCache.setSession(newSession);
        console.log('Store session');
        // Close the page since we don't need it anymore
        await page.close();
      }
    });
  
    test.afterAll(async () => {
      // Clean up the context after all tests have finished
      await context.close();
    });
  
    test('Test 1', async () => {
      // Use the logged-in context and page for your test
      const page = await context.newPage();
      await page.goto('https://parabank.parasoft.com/parabank/openaccount.htm');
      // Test assertions...
      const title = page.locator("//*[@class='ng-scope']//*[@class='title']")
      await expect(title).toContainText('Open New Account');
      await page.close();
    });
  
    test.only('Test 2', async () => {
      // Use the logged-in context and page for your test
      const page = await context.newPage();
      await page.goto('https://parabank.parasoft.com/parabank/transfer.htm');
      // Test assertions...
      const title = page.locator("//*[@class='ng-scope']//*[@class='title']")
      await expect(title).toContainText('Transfer Funds');
      await page.close();
    });

    test('Test 3', async () => {
        // Use the logged-in context and page for your test
        const page = await context.newPage();
        await page.goto('https://parabank.parasoft.com/parabank/updateprofile.htm');
        // Test assertions...
        const title = page.locator("//*[@class='ng-scope']//*[@class='title']")
        await expect(title).toContainText('Update Profile');
        await page.close();
      });

      test('Test 4', async () => {
        // Use the logged-in context and page for your test
        const page = await context.newPage();
        await page.goto('https://parabank.parasoft.com/parabank/requestloan.htm');
        // Test assertions...
        const title = page.locator("//*[@class='ng-scope']//*[@class='title']")
        await expect(title).toContainText('Apply for a Loan');
        await page.close();
      });
  });
  