const { chromium } = require('@playwright/test');

module.exports = {
  runCustomTest: async function () {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Step 1: Navigate to the homepage
      await page.goto('http://localhost:4000');
      console.log('Opened the homepage.');

      // Step 2: Interact with multiple categories
      const categories = [
        { name: 'Frukt och Grönt', urlPart: '/kategori/frukt-och-gront' },
        { name: 'Kött, chark & fågel', urlPart: '/kategori/kott-chark-och-fagel' },
        { name: 'Mejeri, ost & ägg', urlPart: '/kategori/mejeri-ost-agg' },
      ];

      for (const category of categories) {
        await page.goto(`http://localhost:4000${category.urlPart}`);
        console.log(`Visited category: ${category.name}`);
        await page.waitForTimeout(1000); // Simulating browsing delay
      }

      // Step 3: Perform product-related interactions
      const productActions = [
        { product: 'Kycklingben Import', verifyText: 'Kycklingben Import' },
        { product: 'Havrebröd', verifyText: 'Havrebröd' },
        { product: 'Veteskorpor Eko', verifyText: 'Veteskorpor Eko' },
      ];

      for (const action of productActions) {
        await page.locator(`text=${action.product}`).click();
        console.log(`Visited product: ${action.product}`);
        const productDetails = page.locator('div.product-details');
        const productName = await productDetails.locator('h2').textContent();
        if (productName === action.verifyText) {
          console.log(`Verified product details for: ${action.product}`);
        } else {
          console.error(`Mismatch in product details for: ${action.product}`);
        }
      }

      // Step 4: Simulate user navigation and interactions
      const navigationSteps = [
        { label: 'Fryst', action: 'click' },
        { label: 'Barn', action: 'click' },
        { label: 'Vegetariskt', action: 'click' },
      ];

      for (const step of navigationSteps) {
        await page.locator(`text=${step.label}`).click();
        console.log(`Navigated to: ${step.label}`);
        await page.waitForTimeout(500);
      }

      // Step 5: Perform sorting actions
      const sortingOptions = [
        { label: 'Sortera:PopulärastA – ÖÖ –', option: 'name-asc' },
        { label: 'Sortera:PopulärastA – ÖÖ –', option: 'topRated' },
        { label: 'Sortera:PopulärastA – ÖÖ –', option: 'price-asc' },
      ];

      for (const sort of sortingOptions) {
        await page.getByLabel(sort.label).selectOption(sort.option);
        console.log(`Applied sorting: ${sort.option}`);
        await page.waitForTimeout(500);
      }

      // Step 6: Simulate a complete user session
      console.log('Simulating user logout...');
      const logoutButton = await page.locator('text=Logout');
      if (logoutButton) {
        await logoutButton.click();
        console.log('User logged out.');
      } else {
        console.log('Logout button not found, ending session.');
      }
    } catch (error) {
      console.error('Error during test execution:', error);
    } finally {
      await browser.close();
      console.log('Browser closed.');
    }
  },
};
