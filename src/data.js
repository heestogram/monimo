export const employees = [
 {id:1,name:'김희준',department:'데이터솔루션팀',role:'프로',initial:'희',color:'lavender',description:'데이터로 더 나은 해결책을 함께 만들어갑니다.',email:'hijun.kim@example.com'},
 {id:7,name:'강기병',department:'ax추진팀',role:'프로',initial:'강',color:'mint',description:'함께 더 좋은 브랜드 경험을 만들어갑니다.',email:'gibyeong.kang@example.com'},
 {id:8,name:'김가연',department:'회원유치지원팀',role:'프로',initial:'가',color:'lavender',description:'함께 일하는 동료의 마음을 응원합니다.',email:'employee8@example.com'},
 {id:9,name:'박세연',department:'LifeCare마케팅팀',role:'프로',initial:'세',color:'peach',description:'함께 일하는 동료의 마음을 응원합니다.',email:'employee9@example.com'},
 {id:10,name:'박찬영',department:'IT기획팀',role:'프로',initial:'찬',color:'pink',description:'함께 일하는 동료의 마음을 응원합니다.',email:'employee10@example.com'},
 {id:11,name:'이채원',department:'프리미엄마케팅팀',role:'프로',initial:'채',color:'blue',description:'함께 일하는 동료의 마음을 응원합니다.',email:'employee11@example.com'},
 {id:12,name:'장호준',department:'로열티마케팅팀',role:'프로',initial:'호',color:'mint',description:'함께 일하는 동료의 마음을 응원합니다.',email:'employee12@example.com'},
 {id:13,name:'최민경',department:'모니모서비스팀',role:'프로',initial:'민',color:'lavender',description:'함께 일하는 동료의 마음을 응원합니다.',email:'employee13@example.com'},
 {id:14,name:'진현준',department:'정보보호팀',role:'프로',initial:'현',color:'peach',description:'함께 일하는 동료의 마음을 응원합니다.',email:'employee14@example.com'},
 {id:15,name:'이유진',department:'회원신용전략팀',role:'프로',initial:'유',color:'pink',description:'함께 일하는 동료의 마음을 응원합니다.',email:'employee15@example.com'},
 {id:16,name:'정다운',department:'금융마케팅팀',role:'프로',initial:'다',color:'blue',description:'함께 일하는 동료의 마음을 응원합니다.',email:'employee16@example.com'},
 {id:17,name:'신성은',department:'디지털사업팀',role:'프로',initial:'성',color:'mint',description:'함께 일하는 동료의 마음을 응원합니다.',email:'employee17@example.com'}
];
export const categories = [{id:'together',label:'최고의 동료',emoji:'🤝',desc:'함께여서 든든해요'},{id:'thanks',label:'따뜻한 배려',emoji:'💙',desc:'작은 배려에 감사해요'},{id:'passion',label:'빛나는 열정',emoji:'✨',desc:'열정에 박수를 보내요'},{id:'idea',label:'멋진 아이디어',emoji:'💡',desc:'새로운 생각을 응원해요'}];
export const designs = [{id:'thanks',label:'고마워요',title:'덕분에 참 든든해요',subtitle:'작은 배려가 큰 힘이 되었어요',theme:'sky',accessory:'heart'},{id:'best',label:'최고예요',title:'당신이 있어 빛나요',subtitle:'오늘도 멋진 당신에게 박수를!',theme:'cream',accessory:'star'},{id:'cheer',label:'응원해요',title:'언제나 응원할게요',subtitle:'우리 함께라면 해낼 수 있어요',theme:'lilac',accessory:'flag'},{id:'together',label:'함께해요',title:'함께라서 더 좋아요',subtitle:'앞으로도 좋은 동료가 되어주세요',theme:'mint',accessory:'flower'}];
export const seedPraises = [];
export function searchEmployees(dept='',name='',exclude=null,directory=employees){return directory.filter(e=>e.id!==exclude && e.department.toLocaleLowerCase().includes(dept.trim().toLocaleLowerCase()) && e.name.includes(name.trim())).sort((a,b)=>a.name.localeCompare(b.name,'ko')); }
export function validatePraise(to,message,category,design,currentId=null,directory=employees){if(!directory.some(e=>e.id===to&&e.id!==currentId))return '칭찬받을 동료를 선택해주세요.';if(!message.trim())return '동료에게 전할 칭찬 메시지를 적어주세요.';if(message.trim().length<10)return '칭찬 메시지를 10자 이상 작성해주세요.';if(message.length>300)return '칭찬 메시지는 300자까지 작성할 수 있어요.';if(!categories.some(c=>c.id===category)||!designs.some(d=>d.id===design))return '칭찬 유형과 카드를 선택해주세요.';return '';}
