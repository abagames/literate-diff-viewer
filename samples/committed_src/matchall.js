const regexp = /t(e)(st(\d?))/g;
const str = "test1test2";

const array = [...str.matchAll(regexp)];

console.log(array[1]);
// expected output: Array ["test2", "e", "st2", "2"]
