const fs = require('fs')
const { Parser } = require('json2csv');

function file_to_players(region) {
  let rawData = fs.readFileSync(`./finalDataALL/${region}_data.json`)
  let regionData = JSON.parse(rawData)
  return regionData
}

const regions = ["BR1", "EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "RU", "TR1"]

let all_games = []
for (let region of regions) {
  let players = file_to_players(region);
  all_games = all_games.concat(players)
}

const fields = Object.keys(all_games[0])
console.log(fields)

const json2csvParser = new Parser({ fields });
const csv = json2csvParser.parse(all_games);

fs.writeFile(`./finalDataALL/all_data.csv`, csv, 'utf8', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }});
  