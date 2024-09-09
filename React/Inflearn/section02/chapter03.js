// 1. 배열의 구조 분해 할당
let arr = [1, 2, 3];

// one에는 1, two에는 2, three에는 3이 할당됨
//let [one, two, three] = arr; 또는
let [one, two, three, four = 4] = arr;

// 2. 객체의 구조 분해 할당
let person = {
    name: "오수진",
    age: 29,
    hobby: "남영훈 괴롭히기",
};

let { name, age, hobby } = person;

// 3. 객체 구조 분해 할당을 이용해서 함수의 매개변수를 받는 방법
const func = ({ name, age, hobby, extra }) => {
    console.log(name, age, hobby, extra);
}

func(person);