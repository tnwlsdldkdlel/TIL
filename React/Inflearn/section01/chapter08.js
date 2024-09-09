// 1. null 병합 연산자
// -> 존재하는 값을 추려내는 기능
// -> null, undefined가 아닌 값을 찾아내는 연산자
let var1;
let var2 = 10;
let ver3 = 20;
let ver4 = var1 ?? var2; // var1이 undefined이기 때문에 var2의 값이 들어가게됨.

// 2. typeof 연산자
// -> 값의 타입을 문자열로 반환하는 기능을 하는 연산자
let var7 = 1;
var7 = "hello";
var7 = true

let t1 = typeof var7;
console.log(t1); // string , boolean