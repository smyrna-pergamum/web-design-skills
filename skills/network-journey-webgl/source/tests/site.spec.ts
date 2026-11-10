import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SECTIONS = ['hero', 'discovery', 'devices', 'ports', 'security', 'reports', 'local', 'final'];

test('all eight chapters are real HTML with one h1', async ({ page }) => {
  await page.goto('/');
  for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h2')).toHaveCount(SECTIONS.length - 1);
});

// The HTML is the same in every tier; audit it without the WebGL loop, which starves axe under software rendering.
test('no accessibility violations (axe, WCAG 2.2 AA)', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.waitForTimeout(800);
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  const serious = result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
});

test('no horizontal scroll at 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/');
  for (const id of SECTIONS) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `#${id}`).toBeLessThanOrEqual(0);
  }
});

test('links are real and external links are safe', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('a[href]').evaluateAll((as) => as.map((a) => ({ href: a.getAttribute('href') ?? '', rel: a.getAttribute('rel') ?? '' })));
  expect(links.length).toBeGreaterThan(10);
  for (const l of links) {
    expect(l.href, 'empty href').not.toBe('');
    if (l.href.startsWith('http')) {
      expect(l.href).toMatch(/^https:\/\/github\.com\/smyrna-pergamum\/Lanora/);
      expect(l.rel).toContain('noopener');
    } else expect(l.href.startsWith('#') || l.href.startsWith('/')).toBe(true);
  }
});

test('the site makes no third-party requests', async ({ page, baseURL }) => {
  const hosts = new Set<string>();
  page.on('request', (r) => hosts.add(new URL(r.url()).host));
  await page.goto('/');
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(2500);
  expect([...hosts].filter((h) => h !== new URL(baseURL!).host)).toEqual([]);
});

test('device details open from the keyboard and close with Escape', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('#discovery .devlist button').first();
  await btn.focus();
  await page.keyboard.press('Enter');
  const panel = page.locator('aside[aria-labelledby="panel-name"]');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('192.168.2.1');
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(btn).toBeFocused();
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('switches to the Static tier with still images', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/tier-static/);
    await expect(page.locator('#gl')).toBeHidden();
    const still = page.locator('#hero img.still');
    await expect(still).toBeVisible();
    await expect.poll(() => still.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  });
});

test('report selector changes the command shown', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('group', { name: 'Report format' }).getByRole('button', { name: 'JSON' }).click();
  await expect(page.locator('#reports pre')).toContainText('lanora scan 192.168.1.0/24 --format json');
});
