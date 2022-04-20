//https://americas.api.riotgames.com/tft/match/v1/matches/OC1_515761087?api_key=RGAPI-f6b80a5d-ebe9-4cef-9e9b-087462a71537
const api_key = require('./api_key.json').key
const axios = require('axios')
const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]
// The AMERICAS routing value serves NA, BR, LAN, LAS, and OCE. The ASIA routing value serves KR and JP. The EUROPE routing value serves EUNE, EUW, TR, and RU.
const americas = ["NA1", "BR1", "LA1", "LA2", "OC1"]
const asia = ["KR", "JP1"]
const europe = ["EUN1", "EUW1", "TR1", "RU"]
const continents = ["americas", "asia", "europe"]
const game_date = "4-13-2022"
const firstFullDayOfPatch = new Date(2022, 3, 7, 0, 0, 0, 0);

function delay(time) { // can't exceed rate limit
  return new Promise(resolve => setTimeout(resolve, time));
}

async function get_games(region, gameId) {
  const { data } = await axios.get(`https://${region}.api.riotgames.com/tft/match/v1/matches/${gameId}?api_key=${api_key}`)
  // console.log(data)
  return data;
}

async function get_all_gameIds_per_region(region) {
  let today = (new Date()).toLocaleDateString().split("/").join("-")
  let rawData = fs.readFileSync(`./gamesPerContinent/regionSorted/${region}_gameIds_sorted.json`)
  let regionData = JSON.parse(rawData)
  console.log(regionData)
  let games = []
  let totalLen = regionData.length
  let cnt = 0;
  let continent = "";
  let delaytime = 1000;
  if (americas.includes(region)) { // change delaytime based on region to make this go faster without making it too fast
    continent = "americas"
    delaytime = 1000;
  } else if (asia.includes(region)) {
    continent = "asia"
    delaytime = 800
  } else if (europe.includes(region)) {
    continent = "europe"
    delaytime = 950
  }
  for (gameId of regionData) {
    cnt += 1;
    let info = await get_games(continent, gameId);
    if (new Date(info.info.game_datetime) < firstFullDayOfPatch) {
      console.log(`Reached first day of patch in ${region}`);
      break;
    }
    games.push(info)
    await delay(delaytime); // can do 100 requests per 2 minutes
    if (cnt % 100 == 0) {
      fs.writeFile(`./gameData/partial/${region}_games_${cnt-99}-${cnt}.json`, JSON.stringify(games), 'utf8', (err) => {
        if (err)
          console.log(err);
        else {
          console.log("Partial file written successfully");
        }});
    }
    console.log(`${region} progress: ${cnt} / ${totalLen}`)
  }
  fs.writeFile(`./gameData/full/${region}_games_all.json`, JSON.stringify(games), 'utf8', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("Full file written successfully");
    }});
}

// let sampleRegions = ["NA1", "EUW1", "KR1"]
// let sampleRegions = ["OC1", "EUN1", "JP1"]
// let sampleRegions = ["BR1", "TR1"]
// let sampleRegions = ["LA1", "TR1"]
let sampleRegions = ["LA2", "RU"]

for (let region of sampleRegions) {
  get_all_gameIds_per_region(region);
}