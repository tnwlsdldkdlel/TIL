// 1. 콜백함수
function main(value) {
    value();
}

function sub() {
    console.log("sub");
}

main(sub); // sub을 콜백함수라고 부름.
main(() => {
    console.log("sub2");
})