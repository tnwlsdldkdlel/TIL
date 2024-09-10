// 5가지 배열 변형 메서드
// 1. filter
// 기존 배열에서 조건을 만족하는 요소들만 필터링하여 새로운 배열로 변환
let arr1 = [
    { name: "오수진1", hobby: "취미1" },
    { name: "오수진2", hobby: "취미1" },
    { name: "오수진3", hobby: "취미3" },
];

const hobby1Pelole = arr1.filter((item) => {
    if (item.hobby === "취미1") return true;
});

console.log(hobby1Pelole);

// 2. map
// 배열의 모둔 요소를 순회하고, 각각의 콜백함수를 실행하고 그 결과값들을 모아서 새로운 배열로 반환
let arr2 = [1, 2, 3];
arr2.map((item, idx, arr) => {
    console.log(idx, item);
});

console.log(arr2);

// 3. sort
// 배열을 사전순으로 정렬하는 메서드
let arr3 = [10, 3, 5];
arr3.sort((a, b) => {
    if (a > b) {
        // b가 a앞에 와라
        return 1;
    } else if (a < b) {
        // a가 b앞으로 와라
        return -1;
    } else {
        return 0;
    }
});

console.log(arr3);