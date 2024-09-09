// 1. 객체설정
let obj1 = new Object(); // 객체 생성자
let obj2 = {}; // 객체 리터럴 (대부분 사용)

// 2. 객체 프로퍼티 (객체 속성)
let person = {
    name: "오수진",
    age: 29,
    hobby: "남영훈 괴롭히기",
    extra: {},
    "like cat": true,
}

// 3. 객체 프로퍼티를 다루는 방법
// 3.1 특정 프로퍼티에 접근 (점 표기법, 괄호 표기법)
// 동적으로 꺼내는거 아니면 점 표기법이 좋음!
let name = person.name;
console.log(name);

let hobby = person["hobby"];

// 3.1 새로운 프로퍼티를 추가하는 방법
person.job = "test";
person["food"] = "떡볶이";

// 3.2 삭제하는 방법
delete person.food;

// 3.3 프로퍼티의 존재 유뮤를 확인하는 방법 (in 연산자)
let result = "name" in person;
console.log(result);