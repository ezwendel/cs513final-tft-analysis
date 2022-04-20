// api_key = require('./api_key.json').key
// console.log(api_key)

let sample = new Date(1649810931754)
let sample2 = new Date(1650265442902)
let firstFullDayOfPatch = new Date(2022, 3, 7, 0, 0, 0, 0)
let lastDayOfPatch = new Date(2022, 3, 13, 0, 0, 0, 0)

if (firstFullDayOfPatch < sample2 && sample2 < lastDayOfPatch) {
  console.log("between")
} else {
  console.log("not between")
}

console.log(sample2) // 2 am apr 18 EST
console.log(lastDayOfPatch)