const fs = require('fs')
let filename = 'gamesPerContinent50/americas_gameIds_4-13-2022.json'

let rawData = fs.readFileSync(filename)
let regionData = JSON.parse(rawData)
console.log(regionData.length)