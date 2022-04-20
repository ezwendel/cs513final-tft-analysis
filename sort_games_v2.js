const fs = require('fs')
const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]
const americas = ["NA1", "BR1", "LA1", "LA2", "OC1"]
const asia = ["KR", "JP1"]
const europe = ["EUN1", "EUW1", "TR1", "RU"]
const continents = ["americas", "asia", "europe"]
const game_date = "4-13-2022"

function sort_region(region) {
  console.log(region)
  let continent = "";
  if (americas.includes(region)) {
    continent = "americas"
  } else if (asia.includes(region)) {
    continent = "asia"
  } else if (europe.includes(region)) {
    continent = "europe"
  }
  let rawData = fs.readFileSync(`./gamesPerContinent/${continent}_gameIds_${game_date}.json`)
  let gameData = JSON.parse(rawData)
  let filtered = gameData.filter(function (str) { return str.indexOf(region) > -1; });
  filtered.sort().reverse()
  fs.writeFile(`./gamesPerContinent/regionSorted/${region}_gameIds_sorted.json`, JSON.stringify(filtered), 'utf8', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }});
}

for (let region of regions) {
  sort_region(region)
}

// sort_region("NA1")