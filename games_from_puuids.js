const api_key = require('./api_key.json').key
const axios = require('axios')
const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]
// The AMERICAS routing value serves NA, BR, LAN, LAS, and OCE. The ASIA routing value serves KR and JP. The EUROPE routing value serves EUNE, EUW, TR, and RU.
const americas = ["NA1", "BR1", "LA1", "LA2", "OC1"]
const asia = ["KR", "JP1"]
const europe = ["EUN1", "EUW1", "TR1", "RU"]
const continents = ["americas", "asia", "europe"]

function delay(time) { // can't exceed rate limit
  return new Promise(resolve => setTimeout(resolve, time));
}

async function get_gameIds(region, puuid, count) {
  const { data } = await axios.get(`https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${count}&api_key=${api_key}`)
  return data;
}

async function get_all_gameIds_per_region(region) {
  let today = (new Date()).toLocaleDateString().split("/").join("-")
  let rawData = fs.readFileSync(`./regionCompiledPUUIDs/${today}/${region}_puuids_${today}.json`)
  let regionData = JSON.parse(rawData)
  let matches = []
  for (player of regionData) {
    let info = await get_gameIds(region, player.puuid, 50)
    matches = matches.concat(info)
    await delay(1200); // can do 100 requests per 2 minutes
  }
  let uniqueMatches = [...new Set(matches)];;
  let json = JSON.stringify(uniqueMatches)
  fs.writeFile(`./gamesPerContinent50/${region}_gameIds_${today}.json`, json, 'utf8', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }});
}

for (let continent of continents) {
  get_all_gameIds_per_region(continent)
}
