export const employees = [
 {id:1,name:'김민지',department:'브랜드마케팅팀',role:'프로',initial:'민',color:'lavender',description:'좋은 브랜드 경험을 함께 만들어갑니다.',email:'minji.kim@example.com'},
 {id:2,name:'이준호',department:'디지털서비스팀',role:'프로',initial:'준',color:'blue',description:'더 편리한 금융 서비스를 고민합니다.',email:'junho.lee@example.com'},
 {id:3,name:'박서연',department:'브랜드마케팅팀',role:'프로',initial:'서',color:'pink',description:'함께하는 일의 힘을 믿습니다.',email:'seoyeon.park@example.com'},
 {id:4,name:'정다은',department:'인재운영팀',role:'프로',initial:'다',color:'mint',description:'서로의 성장을 응원합니다.',email:'daeun.jung@example.com'},
 {id:5,name:'최현우',department:'데이터전략팀',role:'프로',initial:'현',color:'peach',description:'데이터에서 새로운 가능성을 찾습니다.',email:'hyunwoo.choi@example.com'},
 {id:6,name:'김지수',department:'디지털서비스팀',role:'프로',initial:'지',color:'blue',description:'함께 고민하고, 함께 해결해요.',email:'jisoo.kim@example.com'},
 {id:7,name:'강기뱅',department:'bx추진팀',role:'프로',initial:'강',color:'mint',description:'함께 더 좋은 브랜드 경험을 만들어갑니다.',email:'gibaeng.kang@example.com'}
];
export const categories = [{id:'together',label:'최고의 동료',emoji:'🤝',desc:'함께여서 든든해요'},{id:'thanks',label:'따뜻한 배려',emoji:'💙',desc:'작은 배려에 감사해요'},{id:'passion',label:'빛나는 열정',emoji:'✨',desc:'열정에 박수를 보내요'},{id:'idea',label:'멋진 아이디어',emoji:'💡',desc:'새로운 생각을 응원해요'}];
export const designs = [{id:'thanks',label:'고마워요',title:'덕분에 참 든든해요',subtitle:'작은 배려가 큰 힘이 되었어요',theme:'sky',accessory:'heart'},{id:'best',label:'최고예요',title:'당신이 있어 빛나요',subtitle:'오늘도 멋진 당신에게 박수를!',theme:'cream',accessory:'star'},{id:'cheer',label:'응원해요',title:'언제나 응원할게요',subtitle:'우리 함께라면 해낼 수 있어요',theme:'lilac',accessory:'flag'},{id:'together',label:'함께해요',title:'함께라서 더 좋아요',subtitle:'앞으로도 좋은 동료가 되어주세요',theme:'mint',accessory:'flower'}];
export const seedPraises = [
 {id:'s1',to:1,from:2,category:'together',design:'thanks',message:'급한 일정에도 함께 고민하고 도와주셔서 정말 감사해요. 민지 프로님 덕분에 캠페인을 잘 마무리할 수 있었어요! 함께 일할 수 있어 든든합니다 💙',date:'2026-11-02T02:20:00Z'},
 {id:'s2',to:1,from:4,category:'idea',design:'best',message:'회의 때 제안해주신 아이디어 덕분에 새로운 방향을 찾았어요. 늘 다른 시선으로 생각해주시는 민지 프로님, 최고예요!',date:'2026-10-30T07:10:00Z'},
 {id:'s3',to:1,from:3,category:'thanks',design:'together',message:'처음 맡는 업무라 막막했는데 차근차근 알려주셔서 감사해요. 따뜻한 배려 덕분에 한 걸음 더 성장했어요.',date:'2026-10-28T04:00:00Z'},
 {id:'s4',to:2,from:1,category:'passion',design:'cheer',message:'서비스 오픈까지 꼼꼼하게 챙겨주신 준호 프로님! 끝까지 집중하는 모습이 정말 멋졌어요. 다음 프로젝트도 함께해요!',date:'2026-10-27T05:00:00Z'},
 {id:'s5',to:3,from:5,category:'together',design:'thanks',message:'서로 다른 의견도 귀 기울여 들어주셔서 감사해요. 함께하는 과정이 즐거웠습니다!',date:'2026-10-29T05:00:00Z'}
];
export function searchEmployees(dept='',name='',exclude=null){return employees.filter(e=>e.id!==exclude && e.department.includes(dept.trim()) && e.name.includes(name.trim()));}
export function validatePraise(to,message,category,design){if(!to)return '칭찬받을 동료를 선택해주세요.';if(!message.trim())return '동료에게 전할 칭찬 메시지를 적어주세요.';if(message.trim().length<10)return '칭찬 메시지를 10자 이상 작성해주세요.';if(message.length>300)return '칭찬 메시지는 300자까지 작성할 수 있어요.';if(!categories.some(c=>c.id===category)||!designs.some(d=>d.id===design))return '칭찬 유형과 카드를 선택해주세요.';return '';}
