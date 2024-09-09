// 6가지의 요소 조작 메서드

// 1. push
// 배열의 맨 뒤에 새로운 요소를 추가하는 메서드
let arr1 = [1, 2, 3];
arr1.push(4);
console.log(arr1); // 결과값 : [1, 2, 3, 4]

// 2. pop
// 배열의 맨 뒤에 있는 요서를 제거하고 반환
let arr2 = [1, 2, 3];
arr2.pop();
console.log(arr2); // 결과값 : [1, 2]

// 3. shift
// 배열의 맨 앞에 있는 요소를 제거 반환
let arr3 = [1, 2, 3];
const item = arr3.shift();
console.log(item); // 결과값 : 1
console.log(arr3); // 결과값 : [2, 3]

// 4. unshift
// 배열의 맨 앞에 새로운 요소를 추가하는 메소드
let arr4 = [1, 2, 3];
arr4.unshift(0);
console.log(arr4); // 결과값 : [0, 1, 2, 3]

// 5. slice
// 마치 가위처럼, 배열의 특정 범위를 잘라내서 새로운 배열로 반환
let arr5 = [1, 2, 3, 4, 5];
let sliced = arr5.splice(2, 5);
console.log(sliced); // 결과값 : [3, 4, 5]