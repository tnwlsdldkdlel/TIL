console.log(1);

// setTimeout이 비동기 함수이기 때문에 나중에 3이 출력된 다음 2가 출력됨
setTimeout(() => {
    console.log(2);
}, 3000);


console.log(3);
// 결과값 : 1 3 2