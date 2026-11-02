import {test,expect} from '@playwright/test';
test('landing login validation, protected navigation, persistence and logout',async({page})=>{
 await page.goto('/#profile');
 await expect(page.locator('#login-form')).toBeVisible();
 await expect(page.locator('#login-id')).toHaveAttribute('placeholder','c사번 입력');
 await expect(page.locator('#login-pw')).toHaveAttribute('type','password');
 await page.getByRole('button',{name:'로그인',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('모두 입력');
 await page.locator('#login-id').fill('c123456');await page.locator('#login-pw').fill('wrong');
 await page.getByRole('button',{name:'로그인',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('시연용');
 await page.locator('#login-pw').fill('demo1234');await page.locator('#login-pw').press('Enter');
 await expect(page.locator('#send-praise')).toBeVisible();
 await page.reload();await expect(page.locator('#send-praise')).toBeVisible();
 const storage=await page.evaluate(()=>JSON.stringify({local:{...localStorage},session:{...sessionStorage}}));
 expect(storage).not.toContain('demo1234');expect(storage).not.toContain('c123456');
 await page.locator('#logout').click();await expect(page.locator('#login-form')).toBeVisible();
 await page.goto('/#my');await expect(page.locator('#login-form')).toBeVisible();
});
test('login responsive layout and reward image',async({page})=>{
 await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'/tmp/maeum-login-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/maeum-login-mobile.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('#login-id').fill('c123456');await page.locator('#login-pw').fill('demo1234');await page.getByRole('button',{name:'로그인',exact:true}).click();
 const image=page.locator('.reward-notice img');await expect(image).toBeVisible();expect(await image.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
});
test('all profile counts match histories and jelly ledger has no hidden balance',async({page})=>{
 await page.goto('/');await page.locator('#login-id').fill('c123456');await page.locator('#login-pw').fill('demo1234');await page.getByRole('button',{name:'로그인',exact:true}).click();
 await page.locator('[data-nav="my"]').first().click();
 await expect(page.locator('.summary-stat').first().locator('strong')).toHaveText('3개');
 await expect(page.locator('.history-card')).toHaveCount(3);
 await page.locator('[data-filter="thanks"]').click();await expect(page.locator('.list-heading h2')).toContainText('1');await expect(page.locator('.history-card')).toHaveCount(1);
 await page.locator('[data-my-tab="jelly"]').click();await expect(page.locator('.jelly-row-title')).toHaveCount(3);await expect(page.locator('.jelly-row.total')).toContainText('30 젤리');await expect(page.locator('.jelly-row.balance')).toHaveCount(0);
 await page.locator('[data-nav="profile"]').first().click();
 for(const [name,total] of [['김히준',3],['이준호',1],['박서연',1],['정다은',0],['최현우',0],['김지수',0]]){
  await page.locator('#profile-search').fill(name);await page.locator('[data-profile-person]').click();
  await expect(page.locator('.temperature-stat strong')).toHaveText(total+'번');await expect(page.locator('.history-card')).toHaveCount(total);
  await expect(page.locator('[data-profile-tab="praise"] span')).toHaveText(String(total));
 }
});
