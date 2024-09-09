// 1. Spread 연산자
// -> Spread : 흩뿌리다, 펼치라 라는 뜻
// -> 객체나 배열에 저장된 여러개의 값을 개별로 흩뿌려주는 역할

let arr1 = [1, 2, 3];
let arr2 = [4, ...arr1, 5, 6]; // == [4,1,2,3,5,6]

let obj1 = {
    a: 1,
    b: 2,
};

let obj2 = {
    ...obj1,
    c: 3,
    d: 4,
};

function funcA(p1, p2, p2) {
    console.log(p1, p2, p2);
}

funcA(...arr1); // 결과값 1 2 3

// 2. Rest 매개변수
// -> Rext 는 나머지, 나머지 매개변수
function funcB(...rest) {
    console.log(rest); // [1, 2, 3]
}

funcB(...arr1);

// 첫번째 매개변수의 이름을 바꾸고싶은 경우
function funcC(one, ...rest) {
    console.log(one); // 1
    console.log(rest); // [2, 3]
}

funcC(...arr1);


let o1 = { name: "오수진" };
let o2 = { ...o1 }
o2.name = "육수진";

console.log(o1.name); // 육수진
console.log(o2.name); // 육수진