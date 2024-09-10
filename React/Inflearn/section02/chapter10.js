// 1. Date 객체를 생성하는 방법
let date1 = new Date();
let date2 = new Date(1995, 8, 11);

// 2. 타임 스탬프
// 특정 시간이 "1995.08.11"로 부터 몇 ms가 지났는지를 의미하는 숫자값
let ts1 = date1.getTime();
let date4 = new Date(ts1);

// 3. 시간 요소들을 추출하는 방법
let year = date1.getFullYear();
let month = date1.getMonth();
let date = date1.getDate();

let hour = date1.getHours();
let minute = date1.getMinutes();
let seconds = date1.getSeconds();

console.log(year, month, date, hour, minute, seconds);

// 4. 시간 수정하기
date1.setFullYear(2024);
date1.setMonth(9);
date1.setDate(10);

console.log(date1);