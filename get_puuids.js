const api_key = require('./api_key.json').key
const axios = require('axios')
const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]
// The AMERICAS routing value serves NA, BR, LAN, LAS, and OCE. The ASIA routing value serves KR and JP. The EUROPE routing value serves EUNE, EUW, TR, and RU.
const americas = ["NA1", "BR1", "LA1", "LA2", "OC1"]
const asia = ["KR", "JP1"]
const europe = ["EUN1", "EUW1", "TR1", "RU"]

function delay(time) { // can't exceed rate limit
  return new Promise(resolve => setTimeout(resolve, time));
}

async function get_puuid(region, summonerId) {
  const { data } = await axios.get(`https://${region}.api.riotgames.com/tft/summoner/v1/summoners/${summonerId}?api_key=${api_key}`)
  let continent = "";
  if (americas.includes(region)) {
    continent = "americas"
  } else if (asia.includes(region)) {
    continent = "asia"
  } else if (europe.includes(region)) {
    continent = "europe"
  }
  console.log({puuid: data.puuid, continent: continent})
  return {puuid: data.puuid, continent: continent};
}

async function get_all_puuids_per_region(region) {
  let today = (new Date()).toLocaleDateString().split("/").join("-")
  let rawData = fs.readFileSync(`./challengerPlayers/${today}/${region}_chall_${today}.json`)
  let regionData = JSON.parse(rawData)
  let players = []
  for (player of regionData) {
    let info = await get_puuid(region, player.summonerId)
    players.push(info)
    await delay(1200); // can do 100 requests per 2 minutes
  }
  let json = JSON.stringify(players)
  fs.writeFile(`./challengerPlayerPUUIDs/${today}/${region}_puuids_${today}.json`, json, 'utf8', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }});
}

// for (let region of regions) {
//   get_challengers(region)
// }

// get_puuid("NA1", "vNDJfPgtddjUbxCTV46AMHJnDsKjOh8FTdrXGG6V6qix6xo")
// get_all_puuids_per_region("NA1")
for (region of regions) {
  get_all_puuids_per_region(region)
}
