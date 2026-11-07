import {test,expect} from '@playwright/test';
import {nextStep,previousStep} from './helpers.js';
test('four pages validate each step and preserve the draft when moving back',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');await page.locator('#login-id').fill('wizard-user');await page.locator('#login-pw').fill('demo');await page.locator('.login-submit').click();await page.locator('.sidebar [data-nav="send"]').click();
 await expect(page.locator('[data-step-panel]:visible')).toHaveCount(1);
 await expect(page.locator('#send-praise')).toBeHidden();await expect(page.locator('#wizard-back')).toBeHidden();
 await page.locator('#wizard-next').click();await expect(page.locator('#wizard-error')).toContainText('동료');
 await page.locator('#employee-select').selectOption('7');await nextStep(page,2);
 await page.locator('#wizard-next').click();await expect(page.locator('#wizard-error')).toContainText('메시지');
 await page.locator('#praise-message').fill('짧아요');await page.locator('#wizard-next').click();await expect(page.locator('#wizard-error')).toContainText('10자');
 const message='작은 일에도 함께 고민해주셔서 감사합니다. 항상 큰 힘이 됩니다.';
 await page.locator('#praise-message').fill(message);await page.locator('[data-category="idea"]').click();await nextStep(page,3);
 await page.locator('[data-design="cheer"]').click();await nextStep(page,4);
 await expect(page.locator('[data-step-panel]:visible')).toHaveCount(1);
 await expect(page.locator('.card-to')).toContainText('강기병');await expect(page.locator('.card-message')).toHaveText(message);await expect(page.locator('.praise-preview')).toHaveClass(/lilac/);
 await expect(page.locator('#wizard-next')).toBeHidden();await expect(page.locator('#send-praise')).toBeVisible();
 await previousStep(page,3);await expect(page.locator('[data-design="cheer"]')).toHaveAttribute('aria-pressed','true');
 await previousStep(page,2);await expect(page.locator('#praise-message')).toHaveValue(message);await expect(page.locator('[data-category="idea"]')).toHaveAttribute('aria-pressed','true');
 await previousStep(page,1);await expect(page.locator('#employee-select')).toHaveValue('7');
 await nextStep(page,2);await nextStep(page,3);await nextStep(page,4);
 await page.locator('#send-praise').click();await page.locator('#confirm-send').click();await page.locator('#send-another').click();
 await expect(page.locator('#praise-wizard')).toHaveAttribute('data-step','1');await expect(page.locator('#employee-select')).toHaveValue('');
});
test('wizard fades and mobile pages remain within viewport',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.goto('/');
 await page.locator('#login-id').fill('mobile-wizard');await page.locator('#login-pw').fill('demo');await page.locator('.login-submit').click();await page.locator('.sidebar [data-nav="send"]').click();
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.locator('#employee-select').selectOption('8');
 await page.locator('#wizard-next').click();await expect(page.locator('#praise-wizard')).toHaveAttribute('aria-busy','true');
 await expect(page.locator('#praise-wizard')).toHaveAttribute('data-step','2');await expect(page.locator('#praise-wizard')).not.toHaveAttribute('aria-busy','true');
 await page.locator('#praise-message').fill('언제나 함께해주셔서 감사합니다. 따뜻한 마음을 전해요.');
 for(let step=2;step<=4;step++){
  await expect(page.locator('[data-step-panel]:visible')).toHaveCount(1);
  for(const width of [360,390,430,1440]){
   await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:`/tmp/maeum-wizard-${step}.png`,fullPage:true});
  if(step<4)await nextStep(page,step+1);
 }
});
test('intro grows MO on white, moves to the corner, reveals login and does not replay at logout',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.brand-intro')).toBeVisible();await expect(page.locator('.brand-intro')).toHaveCSS('background-color','rgb(255, 255, 255)');
 await expect(page.locator('.intro-logo')).toContainText('마음');await expect(page.locator('.login-page')).toHaveJSProperty('inert',true);
 await page.screenshot({path:'/tmp/maeum-intro-start.png'});
 await expect(page.locator('.brand-intro')).toHaveCount(0,{timeout:6000});
 await expect(page.locator('.login-page')).toHaveJSProperty('inert',false);
 await page.locator('#login-id').fill('intro');await page.locator('#login-pw').fill('demo');await page.locator('.login-submit').click();await page.locator('.sidebar [data-nav="send"]').click();await page.locator('#logout').click();
 await expect(page.locator('.brand-intro')).toHaveCount(0);await expect(page.locator('#login-id')).toBeEditable();
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await expect(page.locator('.brand-intro')).toHaveCount(0);await expect(page.locator('.login-page')).toHaveJSProperty('inert',false);
});
test('composer actions fit on desktop and phone screens without page scrolling',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.locator('#login-id').fill('compact-demo');await page.locator('#login-pw').fill('demo');await page.locator('.login-submit').click();
 await expect(page.getByText('‘예시 칭찬’은 12명의 프로에게',{exact:false})).toHaveCount(0);
 await page.locator('.sidebar [data-nav="send"]').click();
 const sizes=[{width:1366,height:768},{width:1024,height:768},{width:390,height:844},{width:360,height:740},{width:360,height:640}];
 for(let step=1;step<=4;step++){
  for(const size of sizes){
   await page.setViewportSize(size);await page.evaluate(()=>window.scrollTo(0,0));
   const layout=await page.evaluate(()=>{
    const actions=document.querySelector('.wizard-actions').getBoundingClientRect();
    const nav=document.querySelector('.sidebar nav').getBoundingClientRect();
    const stage=document.getElementById('wizard-stage');
    return {pageHeight:document.documentElement.scrollHeight,pageWidth:document.documentElement.scrollWidth,viewport:innerHeight,width:innerWidth,actionsBottom:actions.bottom,navTop:innerWidth<=720?nav.top:innerHeight,stageOverflow:stage.scrollHeight-stage.clientHeight};
   });
   expect(layout.pageHeight,`step ${step}, ${size.width}x${size.height}: ${JSON.stringify(layout)}`).toBeLessThanOrEqual(size.height+1);
   expect(layout.pageWidth).toBeLessThanOrEqual(size.width);
   expect(layout.actionsBottom).toBeLessThanOrEqual(layout.navTop);
   if(size.height>=740)expect(layout.stageOverflow,`step ${step}, ${size.width}x${size.height}`).toBeLessThanOrEqual(2);
   if(size.width===390)await page.screenshot({path:`/tmp/maeum-compact-${step}.png`});
  }
  if(step===1)await page.locator('#employee-select').selectOption('7');
  if(step===2)await page.locator('#praise-message').fill('함께 고민하고 도와주셔서 고마워요. 덕분에 큰 힘이 됐어요!');
  if(step<4)await nextStep(page,step+1);
 }
 // A long message remains fully available by scrolling its own text area.
 await previousStep(page,3);await previousStep(page,2);await page.locator('#praise-message').fill('고맙습니다. '.repeat(37));await nextStep(page,3);await nextStep(page,4);
 await expect(page.locator('.card-message')).toHaveText('고맙습니다. '.repeat(37).trim());
 await expect(page.locator('#send-praise')).toBeInViewport();
});
