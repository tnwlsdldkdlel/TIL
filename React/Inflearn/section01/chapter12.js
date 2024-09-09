function funcA() {
    console.log("funcA");
}

let varA = funcA;
varA();


let varC = () => {
    console.log("varC");
}