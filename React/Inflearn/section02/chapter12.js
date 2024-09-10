function add(a, b, callback) {
    setTimeout(() => {
        const sum = a + b;
        callback(sum);
    }, 3000);
}

add(1, 2, (value) => {
    console.log(value);
});