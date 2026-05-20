import { test, expect } from '@playwright/test';

test.describe('Book Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    await page.unroute('**/*');
  });

  test('should load app and show empty state initially', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Start exploring/i })).toBeVisible();
  });

  test('should search for books and display results', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /Search books/i });
    await searchInput.fill('harry potter');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await expect(page.getByText(/Showing \d+ result/i)).toBeVisible({ timeout: 10000 });
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('should debounce search and reduce API calls', async ({ page }) => {
    let apiCallCount = 0;
    await page.route('**/search.json*', route => {
      apiCallCount++;
      route.continue();
    });

    const searchInput = page.getByRole('searchbox', { name: /Search books/i });
    await searchInput.type('harry', { delay: 50 });
    await searchInput.type(' potter', { delay: 50 });
    
    await expect(page.getByText(/Showing \d+ result/i)).toBeVisible({ timeout: 10000 });
    expect(apiCallCount).toBe(1);
  });

  test('should show search history dropdown when typing', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /Search books/i });
    
    await searchInput.fill('tolkien');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByText(/Showing \d+ result/i)).toBeVisible({ timeout: 10000 });

    await searchInput.clear();
    await searchInput.focus();
    
    const history = page.getByRole('dialog', { name: /Search history/i });
    await expect(history).toBeVisible();
    await expect(history.locator('button').filter({ hasText: 'tolkien' }).first()).toBeVisible();
  });

  test('should clear search input with X button', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /Search books/i });
    await searchInput.fill('test query');
    
    const clearBtn = page.getByTestId('clear-search-btn');
    await expect(clearBtn).toBeVisible();
    
    await clearBtn.click({ force: true });
       
    await expect(searchInput).toHaveValue('', { timeout: 2000 });
  });

  test('should save a book and persist across reload', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /Search books/i });
    await searchInput.fill('harry potter');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(page.getByText(/Showing \d+ result/i)).toBeVisible({ timeout: 10000 });

    const firstArticle = page.locator('article').first();
    const saveBtn = firstArticle.getByRole('button', { name: 'Save' });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click({ force: true });
    
    await expect(page.getByText('💾 Saved Books')).toBeVisible({ timeout: 5000 });
    
    await page.reload();
    await expect(page.getByText('💾 Saved Books')).toBeVisible({ timeout: 5000 });
  });

  test('should show error state when API fails', async ({ page }) => {
    await page.route('**/search.json*', route => route.abort('failed'));

    const searchInput = page.getByRole('searchbox', { name: /Search books/i });
    await searchInput.fill('test');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Unable to load books/i)).toBeVisible();
  });

  test('should paginate through results', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /Search books/i });
    await searchInput.fill('tolkien');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await expect(page.getByText(/Page 1/i)).toBeVisible();

    await page.getByTestId('pagination-next').click();
    await expect(page.getByText(/Page 2/i)).toBeVisible({ timeout: 10000 });
    
    await page.getByTestId('pagination-prev').click();
    await expect(page.getByText(/Page 1/i)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Accessibility', () => {
  test('should have proper ARIA attributes on search', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByRole('searchbox', { name: /Search books/i });
    await expect(searchInput).toHaveAttribute('aria-label', 'Search books');
    await expect(searchInput).toHaveAttribute('aria-autocomplete', 'list');
    await expect(searchInput).toHaveAttribute('aria-controls', 'search-history');
  });

  test('error alert has proper role attribute', async ({ page }) => {
    // Mock BEFORE navigation to avoid race conditions
    await page.route('**/search.json*', route => route.abort('failed'));
    await page.goto('/');
    
    const searchInput = page.getByRole('searchbox', { name: /Search books/i });
    await searchInput.fill('test');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    
    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible({ timeout: 5000 });
    await expect(alert).toHaveAttribute('role', 'alert');
  });
});