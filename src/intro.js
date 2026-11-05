let played = false;
export async function playLoginIntro() {
 const page = document.querySelector('.login-page');
 const target = page?.querySelector('.brand-word');
 if (!target || played || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 played = true;
 page.classList.add('intro-pending');
 page.inert = true;
 window.scrollTo(0, 0);
 const overlay = document.createElement('div');
 overlay.className = 'brand-intro';
 overlay.setAttribute('aria-hidden', 'true');
 const logo = target.cloneNode(true);
 logo.className = 'brand-word intro-logo';
 const font = getComputedStyle(target);
 for (const property of ['fontFamily','fontSize','fontWeight','letterSpacing','lineHeight','color']) logo.style[property] = font[property];
 const mo = logo.querySelector('.brand-mo'), originalMo = target.querySelector('.brand-mo');
 const img = mo.querySelector('img'), originalImg = originalMo.querySelector('img');
 for (const property of ['width','height','marginLeft','marginRight']) mo.style[property] = getComputedStyle(originalMo)[property];
 for (const property of ['width','height','left','top']) img.style[property] = getComputedStyle(originalImg)[property];
 const moWidth = mo.style.width;
 mo.style.width = '8px';
 img.style.opacity = '0';
 overlay.append(logo);
 document.body.append(overlay);
 const animations = [];
 const animate = (element,frames,options) => {
  const animation = element.animate(frames,{fill:'forwards',...options});
  animations.push(animation);
  return animation.finished;
 };
 let finished = false;
 const finish = () => {
  if (finished) return;
  finished = true;
  animations.forEach(animation => animation.cancel());
  overlay.remove();
  page.classList.remove('intro-pending');
  target.style.visibility = '';
  page.inert = false;
  window.removeEventListener('resize',finish);
 };
 window.addEventListener('resize',finish,{once:true});
 const timeout = setTimeout(finish,5000);
 try {
  await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,500))]);
  if (finished || !page.isConnected) return;
  const scale = Math.min(2.4,(innerWidth-64)/target.getBoundingClientRect().width);
  logo.style.transform = `scale(${scale})`;
  await Promise.all([
   animate(mo,[{width:'8px'},{width:moWidth}],{duration:750,delay:350,easing:'cubic-bezier(.22,1,.36,1)'}),
   animate(img,[{opacity:0,transform:'scale(0)'},{opacity:1,transform:'scale(1.12)',offset:.72},{opacity:1,transform:'scale(1)'}],{duration:750,delay:350,easing:'ease-out'})
  ]);
  if (finished || !page.isConnected) return;
  const start = logo.getBoundingClientRect(), end = target.getBoundingClientRect();
  Object.assign(logo.style,{position:'fixed',left:`${start.left}px`,top:`${start.top}px`,transformOrigin:'top left'});
  target.style.visibility = 'hidden';
  await animate(logo,[{left:`${start.left}px`,top:`${start.top}px`,transform:`scale(${scale})`},{left:`${end.left}px`,top:`${end.top}px`,transform:'scale(1)'}],{duration:950,delay:150,easing:'cubic-bezier(.65,0,.25,1)'});
  if (finished || !page.isConnected) return;
  // Fade the white backdrop to reveal the landing page beneath the completed logo.
  page.classList.remove('intro-pending');
  await animate(overlay,[{backgroundColor:'rgba(255,255,255,1)'},{backgroundColor:'rgba(255,255,255,0)'}],{duration:650,easing:'ease-out'});
 } catch {
  // Cancellation or unavailable animation support must never block login.
 } finally {
  clearTimeout(timeout);
  finish();
 }
}
