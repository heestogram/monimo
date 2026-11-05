import {expect} from '@playwright/test';
export async function nextStep(page,step) {
 await page.locator('#wizard-next').click();
 await expect(page.locator('#praise-wizard')).toHaveAttribute('data-step',String(step));
 await expect(page.locator('#praise-wizard')).not.toHaveAttribute('aria-busy','true');
}
export async function previousStep(page,step) {
 await page.locator('#wizard-back').click();
 await expect(page.locator('#praise-wizard')).toHaveAttribute('data-step',String(step));
 await expect(page.locator('#praise-wizard')).not.toHaveAttribute('aria-busy','true');
}
