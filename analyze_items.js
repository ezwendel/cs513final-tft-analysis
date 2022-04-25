const api_key = require('./api_key.json').key
const axios = require('axios')
const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]

function get_items(player) {
  let all_items = []
  for (let unit of player.units) { // go through units to get items
    for (let item of unit.items) {
      all_items.push(item)
    }
  }
  return all_items;
}

function get_all_items(region) {
  let today = (new Date()).toLocaleDateString().split("/").join("-")
  let rawData = fs.readFileSync(`./gameData/full/${region}_games_all.json`,'utf8')
  let gameData = JSON.parse(rawData)
  let items = new Set();
  for (game of gameData) {
    for (player of game.info.participants) {
      let info = get_items(player)
      info.forEach(item => items.add(item))
    }
  }
  let uniqueItems = [... items];
  return uniqueItems;
}

let all_items = []
for (let region of regions) {
  let region_items = get_all_items(region)
  // console.log(region_items)
  all_items = all_items.concat(region_items)
}

// console.log(all_items)
let uniqueItems = [... new Set(all_items)];
let json = JSON.stringify(uniqueItems.sort(function(a, b){return a-b}))
fs.writeFile(`./all_items.json`, json, 'utf8', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }});

