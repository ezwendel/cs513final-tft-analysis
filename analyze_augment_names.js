const api_key = require('./api_key.json').key
const axios = require('axios')
const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]

function get_augments(player) {
  return player.augments;
}

function get_all_augments(region) {
  let today = (new Date()).toLocaleDateString().split("/").join("-")
  let rawData = fs.readFileSync(`./gameData/full/${region}_games_all.json`,'utf8')
  let gameData = JSON.parse(rawData)
  let augments = new Set();
  for (game of gameData) {
    for (player of game.info.participants) {
      let info = get_augments(player)
      info.forEach(augment => augments.add(augment))
    }
  }
  let uniqueAugments = [... augments];
  return uniqueAugments;
}

let all_augments = []
for (let region of regions) {
  let region_augments = get_all_augments(region)
  console.log(region_augments)
  all_augments = all_augments.concat(region_augments)
}

console.log(all_augments)
let uniqueAugments = [... new Set(all_augments)];
let json = JSON.stringify(uniqueAugments.sort())
fs.writeFile(`./all_augments.json`, json, 'utf8', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }});

