import {test,expect} from '@playwright/test';
import {employees} from '../../src/data.js';
async function login(page){
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.locator('#login-id').fill('home-demo');await page.locator('#login-pw').fill('demo');await page.locator('.login-submit').click();
 await expect(page).toHaveURL(/#home$/);await expect(page.locator('.home-intro')).toBeVisible();
}
test('home introduces the service and every fixed profile receives exactly one sample',async({page})=>{
 await login(page);
 await expect(page.locator('.stream-card:not([aria-hidden])')).toHaveCount(12);
 await expect(page.locator('.home-how>div')).toHaveCount(3);
 const entries=await page.evaluate(()=>JSON.parse(localStorage.getItem('maeum-praises-v2')));
 expect(entries).toHaveLength(12);expect(new Set(entries.map(p=>p.id)).size).toBe(12);
 for(const employee of employees){
  expect(entries.filter(p=>p.to===employee.id)).toHaveLength(1);
  await page.locator('.sidebar [data-nav="profile"]').click();await page.locator('#profile-search').fill(employee.name);await page.locator(`[data-profile-person="${employee.id}"]`).click();
  await expect(page.locator('.history-card')).toHaveCount(1);await expect(page.locator('.temperature-stat strong')).toHaveText('1번');await expect(page.getByRole('meter')).toHaveAttribute('aria-valuenow','36.8');
 }
 await page.locator('.sidebar .brand').click();await expect(page).toHaveURL(/#home$/);
 await page.locator('.stream-card:not([aria-hidden])').first().click();await expect(page.getByRole('dialog')).toContainText('예시 칭찬');await page.keyboard.press('Escape');
 await page.locator('.home-buttons [data-nav="send"]').click();await expect(page.locator('#praise-wizard')).toHaveAttribute('data-step','1');await expect(page.locator('#employee-select option')).toHaveCount(13);
 await page.locator('.sidebar [data-nav="my"]').click();await expect(page.locator('.history-card')).toHaveCount(0);
 await page.locator('.sidebar [data-nav="home"]').click();
 for(const width of [360,390,430,1024,1440]){
  await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(width===390||width===1440)await page.screenshot({path:`/tmp/maeum-home-${width}.png`,fullPage:true});
 }
});
test('welcome migration preserves existing cards and never duplicates samples on reload',async({page})=>{
 await login(page);
 await page.evaluate(()=>{
  const sample=JSON.parse(localStorage.getItem('maeum-praises-v2'))[0];
  const own={...sample,id:'existing-card',sample:false,to:8,from:Number(sessionStorage.getItem('maeum-session-v2')),message:'업데이트 전에 내가 작성해 두었던 칭찬입니다.'};
  localStorage.setItem('maeum-praises-v2',JSON.stringify([own,sample]));localStorage.removeItem('maeum-welcome-samples-v1');
 });
 await page.reload();
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('maeum-praises-v2')));
 let entries=await read();expect(entries).toHaveLength(13);expect(entries.filter(p=>p.sample)).toHaveLength(12);expect(entries[0].message).toContain('업데이트 전에');
 await page.reload();entries=await read();expect(entries).toHaveLength(13);expect(new Set(entries.map(p=>p.id)).size).toBe(13);
 await page.locator('.sidebar [data-nav="my"]').click();await page.locator('[data-my-tab="sent"]').click();await expect(page.locator('.history-card')).toHaveCount(1);await expect(page.locator('.history-card')).toContainText('업데이트 전에');
});
