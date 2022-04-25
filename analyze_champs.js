const api_key = require('./api_key.json').key
const axios = require('axios')
const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]

function get_champions(player) {
  let all_units = []
  for (let unit of player.units) { // go through units to get items
    all_units.push(unit.character_id)
  }
  return all_units;
}

function get_all_champs(region) {
  let today = (new Date()).toLocaleDateString().split("/").join("-")
  let rawData = fs.readFileSync(`./gameData/full/${region}_games_all.json`,'utf8')
  let gameData = JSON.parse(rawData)
  let champs = new Set();
  for (game of gameData) {
    for (player of game.info.participants) {
      let info = get_champions(player)
      info.forEach(champ => champs.add(champ))
    }
  }
  let uniqueChamps = [... champs];
  return uniqueChamps;
}

let all_champs = []
for (let region of regions) {
  let region_champs = get_all_champs(region)
  // console.log(region_items)
  all_champs = all_champs.concat(region_champs)
}

// console.log(all_items)
let uniqueChamps = [... new Set(all_champs)];
let json = JSON.stringify(uniqueChamps.sort())
fs.writeFile(`./all_champs.json`, json, 'utf8', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }});

