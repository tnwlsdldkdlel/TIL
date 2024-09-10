// const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log("안녕");
//         resolve("안녕"); // state를 fullfilled로 변경해줌, 매개변수를 넣으면 PromiseResult값이 들어감
//         reject("실패했을 경우");
//     }, 2000);
// });

// setTimeout(() => {
//     console.log(promise);
// }, 3000);


// const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         const num = 'AA';

//         if (typeof num === "number") {
//             resolve(num + 10);
//         } else {
//             reject("num이 숫자가 아닙니다.");
//         }
//     }, 2000)
// });

// // then 메서드
// // resolve되는 경우
// // 여기서 value는 PromiseResult값!
// promise.then((value) => {
//     console.log(value);
// })

// // catch 메서드
// // reject되는 경우
// promise.catch((error) => {
//     console.log(error);
// })

function add10() {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const num = 15;

            if (typeof num === "number") {
                resolve(num + 10);
            } else {
                reject("num이 숫자가 아닙니다.");
            }
        }, 2000)
    });

    return promise;
}

const p = add10();
p.then((value) => {
    console.log(value);
})



