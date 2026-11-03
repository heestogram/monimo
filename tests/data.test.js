import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchEmployees,validatePraise } from '../src/data.js';
test('department-only search and name-only search independently return employees',()=>{
 assert.equal(searchEmployees('회원유치지원팀').length,1);
 assert.equal(searchEmployees('','김가연')[0].id,8);
 assert.equal(searchEmployees('모니모서비스팀','최')[0].name,'최민경');
 assert.equal(searchEmployees('인재운영팀','이준호').length,0);
 assert.equal(searchEmployees('','김희준',1).length,0);
});
test('prevent sending without recipient or meaningful message',()=>{
 assert.ok(validatePraise(null,'좋은 동료가 되어주셔서 감사합니다.','together','thanks'));
 assert.ok(validatePraise(8,' ','together','thanks'));
 assert.ok(validatePraise(8,'감사','together','thanks'));
 assert.ok(validatePraise(8,'가'.repeat(301),'together','thanks'));
 assert.equal(validatePraise(8,'함께 도와주셔서 정말 감사합니다.','together','thanks'),'');
});
