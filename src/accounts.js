// Versioned storage intentionally starts a fresh demo without legacy praise records.
export const ACCOUNT_KEY = 'maeum-accounts-v2';
export const PRAISE_KEY = 'maeum-praises-v2';
export const SESSION_KEY = 'maeum-session-v2';
const adjectives = ['개구진','졸린','다정한','씩씩한','행복한','수줍은','용감한','느긋한','상냥한','반짝이는','포근한','웃는'];
const animals = ['악어','사자','고양이','토끼','곰','수달','펭귄','여우','강아지','코알라','판다','돌고래'];
export function readAccounts() {
 const stored = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
 if (!Array.isArray(stored)) throw new Error('Invalid accounts');
 return stored;
}
export function readPraises() {
 const stored = JSON.parse(localStorage.getItem(PRAISE_KEY) || '[]');
 if (!Array.isArray(stored)) throw new Error('Invalid praises');
 return stored;
}
export function resetLegacyData() {
 localStorage.removeItem('maeum-praises');
 sessionStorage.removeItem('maeum-demo-session');
}
export function restoreAccount() {
 const id = Number(sessionStorage.getItem(SESSION_KEY));
 return readAccounts().find(account => account.id === id) || null;
}
export async function loginAccount(employeeNumber) {
 // A normalized hash identifies the demo account; the password is never stored.
 const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(employeeNumber.trim().toLowerCase()));
 const key = Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
 const accounts = readAccounts();
 let account = accounts.find(item => item.key === key);
 if (!account) {
  const random = crypto.getRandomValues(new Uint32Array(2));
  const baseName = `${adjectives[random[0] % adjectives.length]} ${animals[random[1] % animals.length]}`;
  let name = baseName, suffix = 2;
  while (accounts.some(item => item.name === name)) name = `${baseName} ${suffix++}`;
  let id = -parseInt(key.slice(0, 12), 16) - 1;
  while (accounts.some(item => item.id === id)) id--;
  account = {id, key, name, department:'삼성카드 아이디어톤팀', role:'프로', initial:name[0], color:'mint', description:'따뜻한 칭찬으로 함께 빛나는 하루를 만들어가요.', email:'가상 체험 계정'};
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify([...accounts, account]));
 }
 sessionStorage.setItem(SESSION_KEY, String(account.id));
 return account;
}
export function savePraise(entry) {
 // Re-read before appending so another open tab's saved cards are preserved.
 const next = [entry, ...readPraises()];
 localStorage.setItem(PRAISE_KEY, JSON.stringify(next));
 return next;
}
