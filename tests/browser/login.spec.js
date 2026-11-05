import {test,expect} from '@playwright/test';
async function login(page,id,pw='any-demo-password') {
 await page.locator('#login-id').fill(id);await page.locator('#login-pw').fill(pw);
 await page.getByRole('button',{name:'로그인',exact:true}).click();
 await expect(page.locator('#send-praise')).toBeVisible();
 return page.locator('.current-user strong').innerText();
}
async function send(page,recipient,text) {
 await page.locator('#employee-select').selectOption(String(recipient));
 await page.locator('#praise-message').fill(text);
 await page.locator('#send-praise').click();await page.locator('#confirm-send').click();await page.locator('#view-sent').click();
}
test('arbitrary credentials, stable identity, isolated histories and restricted recipients survive a new session',async({page,context})=>{
 await page.goto('/#profile');await expect(page.locator('#login-form')).toBeVisible();
 await page.getByRole('button',{name:'로그인',exact:true}).click();await expect(page.getByRole('alert')).toContainText('모두 입력');
 const nameA=await login(page,'c987654','first-password');
 const idA=await page.evaluate(()=>sessionStorage.getItem('maeum-session-v2'));
 await page.locator('[data-nav="my"]').first().click();
 await expect(page.locator('.my-welcome')).toContainText('삼성카드 아이디어톤팀');
 await expect(page.locator('.history-card')).toHaveCount(0);
 await page.locator('[data-nav="send"]').first().click();
 await send(page,8,'첫 번째 계정에서 동료에게 전하는 따뜻한 칭찬입니다.');
 await expect(page.locator('.history-card')).toHaveCount(1);
 await page.locator('#logout').click();const nameB=await login(page,'different-number');expect(nameB).not.toBe(nameA);
 await page.locator('[data-nav="my"]').first().click();await page.locator('[data-my-tab="sent"]').click();
 await expect(page.locator('.history-card')).toHaveCount(0);
 await page.locator('[data-nav="send"]').first().click();
 await expect(page.locator('#employee-select option')).toHaveCount(13);
 await expect(page.locator(`#employee-select option[value="${idA}"]`)).toHaveCount(0);
 await page.locator('#name-search').fill(nameA);await expect(page.locator('.employee-result')).toHaveCount(0);
 await page.locator('#name-search').fill('');await page.locator('#dept-search').fill('삼성카드 아이디어톤팀');await expect(page.locator('.employee-result')).toHaveCount(0);
 await page.locator('[data-nav="profile"]').first().click();await page.locator('#profile-search').fill(nameA);await expect(page.locator('[data-profile-person]')).toHaveCount(0);
 await page.locator('[data-nav="send"]').first().click();
 // Even an injected dropdown option cannot select a virtual account.
 await page.evaluate(id=>{const select=document.getElementById('employee-select');select.add(new Option('가상 계정',id));select.value=id;select.dispatchEvent(new Event('change'));},idA);
 await expect(page.locator('.selected-person')).toHaveCount(0);
 await send(page,7,'두 번째 계정에서 강기병 프로에게 응원을 전합니다.');
 await page.locator('#logout').click();
 await login(page,' C987654 ','entirely-different-password');
 await expect(page.locator('.current-user strong')).toHaveText(nameA);
 await page.locator('[data-nav="my"]').first().click();await expect(page.locator('.history-card')).toHaveCount(0);
 await page.locator('[data-my-tab="jelly"]').click();await expect(page.locator('.jelly-row.total')).toContainText('0개');
 await page.locator('#my-profile').click();await expect(page.getByRole('meter')).toHaveAttribute('aria-valuenow','36.5');
 await expect(page.locator('.temperature-stat strong')).toHaveText('0번');
 await page.locator('[data-nav="my"]').first().click();await page.locator('[data-my-tab="sent"]').click();
 await expect(page.locator('.history-card')).toHaveCount(1);await expect(page.locator('.history-card')).toContainText('첫 번째 계정에서');
 const storage=await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}));
 for(const secret of ['first-password','entirely-different-password','c987654'])expect(storage).not.toContain(secret);
 await page.close();const reopened=await context.newPage();await reopened.goto('/');
 await expect(reopened.locator('#login-form')).toBeVisible();await login(reopened,'c987654');
 await expect(reopened.locator('.current-user strong')).toHaveText(nameA);
 await reopened.locator('[data-nav="my"]').first().click();await reopened.locator('[data-my-tab="sent"]').click();await expect(reopened.locator('.history-card')).toHaveCount(1);
});
test('legacy praises reset once while new cards persist',async({page})=>{
 await page.goto('/');await page.evaluate(()=>{localStorage.setItem('maeum-praises',JSON.stringify([{id:'legacy',message:'OLD PRAISE'}]));sessionStorage.setItem('maeum-demo-session','active');});
 await page.reload();await expect(page.locator('#login-form')).toBeVisible();await login(page,'new-user');
 expect(await page.evaluate(()=>localStorage.getItem('maeum-praises'))).toBeNull();
 await expect(page.locator('.praise-stream')).toHaveCount(0);
 await send(page,1,'초기화 이후에 새롭게 저장한 칭찬은 계속 남아 있어요.');
 await page.reload();await page.locator('[data-my-tab="sent"]').click();await expect(page.locator('.history-card')).toHaveCount(1);
 await page.locator('[data-nav="profile"]').first().click();await page.locator('#profile-search').fill('김희준');await page.locator('[data-profile-person="1"]').click();
 await expect(page.locator('.temperature-stat strong')).toHaveText('1번');await expect(page.locator('.history-card')).toHaveCount(1);
});
test('landing fades in, respects reduced motion and fits mobile',async({page})=>{
 await page.goto('/');await expect(page.locator('.login-story-copy h1')).toHaveCSS('animation-name','login-reveal');
 await expect(page.locator('.login-art')).toHaveCSS('animation-name','login-reveal');
 await expect(page.locator('.login-art')).toHaveCSS('opacity','1');
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'/tmp/maeum-login-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/maeum-login-mobile.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.login-art')).toHaveCSS('animation-name','none');await expect(page.locator('.login-art')).toHaveCSS('opacity','1');
 await login(page,'mobile-user');const image=page.locator('.reward-notice img');expect(await image.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
});
test('storage failure does not promise a saved account',async({page})=>{
 await page.goto('/');await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new Error('blocked');};});
 await page.locator('#login-id').fill('blocked-user');await page.locator('#login-pw').fill('anything');await page.getByRole('button',{name:'로그인',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('저장하지 못했어요');await expect(page.locator('#login-form')).toBeVisible();
});
