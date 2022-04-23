const fs = require('fs')

function file_to_players(region) {
  let rawData = fs.readFileSync(`./finalData/${region}_data.json`)
  let regionData = JSON.parse(rawData)
  return regionData
}

const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]

let all_games = []
for (let region of regions) {
  let players = file_to_players(region);
  all_games = all_games.concat(players)
}

fs.writeFile(`./finalData/all_data.json`, JSON.stringify(all_games), 'utf8', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }});
  