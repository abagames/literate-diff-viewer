const regexp = /t(e)(st(\d?))/g;
const str = "test1test2";

const array = [...str.matchAll(regexp)];

console.log(array[0]);
// expected output: Array ["test1", "e", "st1", "1"]
