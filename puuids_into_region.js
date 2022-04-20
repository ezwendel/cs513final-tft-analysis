const api_key = require('./api_key.json').key
const axios = require('axios')
const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]
// The AMERICAS routing value serves NA, BR, LAN, LAS, and OCE. The ASIA routing value serves KR and JP. The EUROPE routing value serves EUNE, EUW, TR, and RU.
const americas = ["NA1", "BR1", "LA1", "LA2", "OC1"]
const asia = ["KR", "JP1"]
const europe = ["EUN1", "EUW1", "TR1", "RU"]

function get_all_puuids_per_region(region) {
  let today = (new Date()).toLocaleDateString().split("/").join("-")
  let rawData = fs.readFileSync(`./challengerPlayerPUUIDs/${today}/${region}_puuids_${today}.json`)
  let regionData = JSON.parse(rawData)
  return regionData;
  let json = JSON.stringify(players)
}

let today = (new Date()).toLocaleDateString().split("/").join("-")

let americasPlayers = []
for (let region of americas) {
  americasPlayers = americasPlayers.concat(get_all_puuids_per_region(region))
}

let asiaPlayers = []
for (let region of asia) {
  asiaPlayers = asiaPlayers.concat(get_all_puuids_per_region(region))
}

let europePlayers = []
for (let region of europe) {
  europePlayers = europePlayers.concat(get_all_puuids_per_region(region))
}

fs.writeFile(`./regionCompiledPUUIDs/${today}/americas_puuids_${today}.json`, JSON.stringify(americasPlayers), 'utf8', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }});

fs.writeFile(`./regionCompiledPUUIDs/${today}/asia_puuids_${today}.json`, JSON.stringify(asiaPlayers), 'utf8', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }});

fs.writeFile(`./regionCompiledPUUIDs/${today}/europe_puuids_${today}.json`, JSON.stringify(europePlayers), 'utf8', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }});