// 1. 배열 순회
let arr = [1, 2, 3];

// 1.1 배열 인덱스
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

// 1.2 for of 반복문
for (let item of arr) {
    console.log(item);
}

// 2. 객체순회
let person = {
    name: "오수진",
    age: 29,
    hobby: "남영훈 괴롭히기",
};

// 2.1 Object.keys 사용
// -> 객체에서 key 값들만 뽑아서 새로운 배열로 반환
let keys = Object.keys(person);
console.log(keys); // 결과값 :  ['name', 'age', 'hobby']
for (let key of keys) {
    console.log(key);
}

// 2.2. Objecy.values
// -> 객체에서 value 값들만 뽑아서 새로운 배열로 반환
let values = Object.values(person);
console.log(values); // 결과값 : ['오수진', 29, '남영훈 괴롭히기']

// 2.3 for in
for (let key of person) {
    console.log(key);
}