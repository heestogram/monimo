import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchEmployees,validatePraise } from '../src/data.js';
test('department-only search and name-only search independently return employees',()=>{
 assert.equal(searchEmployees('브랜드마케팅팀').length,1);
 assert.equal(searchEmployees('','이준호')[0].id,2);
 assert.equal(searchEmployees('디지털서비스팀','김')[0].name,'김지수');
 assert.equal(searchEmployees('인재운영팀','이준호').length,0);
 assert.equal(searchEmployees('','김히준',1).length,0);
});
test('prevent sending without recipient or meaningful message',()=>{
 assert.ok(validatePraise(null,'좋은 동료가 되어주셔서 감사합니다.','together','thanks'));
 assert.ok(validatePraise(2,' ','together','thanks'));
 assert.ok(validatePraise(2,'감사','together','thanks'));
 assert.ok(validatePraise(2,'가'.repeat(301),'together','thanks'));
 assert.equal(validatePraise(2,'함께 도와주셔서 정말 감사합니다.','together','thanks'),'');
});
