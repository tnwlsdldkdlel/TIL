// 5가지 요서 순회 및 탐색 메소드
// 1. forEach
// 모든 요소를 순회하면서, 각각의 요소에 특정 동작을 수행시키는 메서드
let arr1 = [1, 2, 3];
arr1.forEach(function (item, indx, arr) {
    console.log(indx, item);
});

let doubledArr = [];
arr1.forEach((item) => {
    doubledArr.push(item * 2);
});
console.log(doubledArr); // 결과값 : [2, 4, 6]

// 2. includes
// 배열에 특정 요소가 있는지 확인하는 메서드
let arr2 = [1, 2, 3];
let isInclude = arr2.includes(10);
console.log(isInclude); // 결과값 : false

// 3. indexOf
// 특정 요소의 인덱스를 찾아서 반환하는 메서드
let arr3 = [1, 2, 3];
let index = arr3.indexOf(2);
console.log(index); // 결과값 : 1

// 4. findIndex
// 모든 요소를 순회하면서, 콜백함수를 만족하는 요소의 인덱스를 반환하는 메소드
let arr4 = [1, 2, 3];
let indx = arr4.findIndex((item) => {
    if (item === 2) return true;
});
console.log(index); // 결과값 : 1 (value 2를 만족하는 인덱스는 1이므로)

// 5. find
// 모든 요소를 순회하면서 콜백함수를 요소를 찾는 요소 그대로 반환하는 메소드
let arr5 = [
    { name: "오수진" },
    { name: "남영훈" },
]
const finded = arr5.find((item) => item.name === "오수진");
console.log(finded);