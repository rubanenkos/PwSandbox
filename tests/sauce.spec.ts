import { test, BrowserContext, Page, expect } from '@playwright/test';
import {SessionCache} from "../src/session"

const sessionCache = SessionCache.getInstance();

test.describe('Sauce tests', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    // Check if the session is already stored
    const session = sessionCache.getSession();

    if (session) {
      // Use the stored session
      context = await browser.newContext(session);
      
    } else {
      // Perform the login step and store the session
      context = await browser.newContext();
      page = await context.newPage();
      await page.goto('https://www.saucedemo.com/');
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      await page.waitForLoadState('networkidle')
      // Store the session in the cache
      const newSession = await context.storageState();
      sessionCache.setSession(newSession);
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
    await page.goto('https://www.saucedemo.com/cart.html');
    // Test assertions...
    await expect(page.getByText('Your Cart')).toBeVisible();
    await page.close();
  });

  test('Test 2', async () => {
    // Use the logged-in context and page for your test
    const page = await context.newPage();
    await page.goto('https://www.saucedemo.com/inventory.html');
    // Actions....
    await page.getByRole('button', { name: 'Open Menu' }).click();
    // Test assertions...
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await page.close();
  });
  test('Test 4', async () => {
    // Use the logged-in context and page for your test
    const page = await context.newPage();
    await page.goto('https://www.saucedemo.com/cart.html');
    // Actions....
    await page.locator('[data-test="checkout"]').click()
    // Test assertions...
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();
    await page.close();
  });

  test('Test 3', async () => {
      // Use the logged-in context and page for your test
      const page = await context.newPage();
      await page.goto('https://www.saucedemo.com/inventory.html');
      // Actions....
      await page.getByRole('button', { name: 'Open Menu' }).click();
      await page.getByRole('link', { name: 'Logout' }).click();
      // Test assertions...
      expect(page.url()).toBe("https://www.saucedemo.com/")
      await page.close();
    });

    
});
