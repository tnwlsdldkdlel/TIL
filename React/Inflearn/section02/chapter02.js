function returnFalse() {
    console.log("false 함수");
    return undefined;
}

function returnTrue() {
    console.log("true 함수");
    return 10;
}

//console.log(returnFalse() && returnTrue());
// 결과값 :
// "false 함수"
// false

// 단락평가 활용 사례
function printName(person) {
    const name = person && person.name;
    console.log(name || "person의 값이 없음.");
}

printName();
printName({ name: "오수진" });