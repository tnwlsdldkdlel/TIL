// async
// 어떤 함수를 비동기 함수로 만들어주는 키워드
// 함수가 프로미스를 반환하도록 변환해주는 그런 키워드

async function getData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                name: "오수진",
                id: "ooooohsu",
            })
        }, 2000)
    })
}

console.log(getData());

// await
// async 함수 내부에서만 사용이 가능 한 키워드
async function getData2() {
    const data = await getData();
    console.log(data);
}

getData2();
